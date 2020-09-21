// import

const {raw: dotenv} = require('./lerna');

// fns

const getValue = (name) => (
  name in dotenv ? (
    name in process.env ? process.env[name] : dotenv[name]
  ) : undefined
);

const createMakeSafe = (types) => (name, value) =>
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

module.exports = function dotenvPlugin(args) {
  const {types} = args;
  const makeSafe = createMakeSafe(types);

  return {
    visitor: {
      MemberExpression(path) {
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
};
