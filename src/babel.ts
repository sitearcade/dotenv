// import

import type * as t from '@babel/types';

import {raw as dotenv} from './config';

// types

type Types = typeof t;

export declare module NodeJS {
  type ProcessEnv = Record<string, string | undefined>;
}

// fns

const getValue = (name: string): string | undefined => (
  name in dotenv ? (
    name in process.env ? process.env[name] : dotenv[name]
  ) : undefined
);

const createMakeSafe = (types: Types) => (name: string, value?: string) =>
  types.logicalExpression(
    '||',
    types.logicalExpression(
      '&&',
      types.logicalExpression(
        '&&',
        types.identifier('process'),
        types.memberExpression(
          types.identifier('process'),
          types.identifier('env'),
        ),
      ),
      types.memberExpression(
        types.identifier('process.env'),
        types.identifier(name),
      ),
    ),
    types.valueToNode(value),
  );

// export

export default function dotenvPlugin(args: {types: Types}) {
  const {types} = args;
  const makeSafe = createMakeSafe(types);

  return {
    visitor: {
      MemberExpression(path: any) {
        if (types.isAssignmentExpression(path.parent) && path.parent.left === path.node) {
          return;
        }

        if (path.get('object').matchesPattern('process.env')) {
          const key = path.toComputedKey();

          if (types.isStringLiteral(key)) {
            const name = key.value;

            path.replaceWith(makeSafe(name, getValue(name)));
          }
        }
      },
    },
  };
}
