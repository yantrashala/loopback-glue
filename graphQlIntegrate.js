const graphql = require('graphql-server-express');
const gqlTools = require('graphql-tools');
const bodyParser = require('body-parser');
const _ = require('lodash');

const ast = require('./lib/ast');
const resolvers = require('./lib/resolvers');
const typeDefs = require('./lib/typedefs');

module.exports = function(app, options) {
	var models = options.subapps[1].app.models();
	var typedefs = {}, resolver = {};
	options.subapps.map(function(subApp) {
		var models = subApp.app.models();
		var types = ast(models);
		_.merge(typedefs,types);
		_.merge(resolver, resolvers(models));
	});
	
	console.log(typeDefs(typedefs))
	let schema = gqlTools.makeExecutableSchema({
        typeDefs: typeDefs(typedefs),
        resolvers: resolver,
        resolverValidationOptions: {
            requireResolversForAllFields: false
        }
    });

    let graphiqlPath = options.graphiqlPath || '/graphiql';
    let path = options.path || '/graphql';

    app.use(path, bodyParser.json(), graphql.graphqlExpress({
        schema: schema
    }));
    app.use(graphiqlPath, graphql.graphiqlExpress({
        endpointURL: path
    }));

//     var mockGraphQl = gqlTools.mockServer(schema);

//     mockGraphQl.query('{\
//   allNotes {\
//     edges {\
//       node {\
//         id\
//         title\
//         content\
//       }\
//     }\
//   }\
// }').then((result) => console.log(JSON.stringify(result)));

}