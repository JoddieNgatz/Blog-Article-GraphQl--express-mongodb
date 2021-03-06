const { query } = require('express');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLSchema } = graphql;
const _ = require('lodash');

let articles = [
    { name: 'The History of Node.js', topic: 'Node.js', date: '2020-08-25T00:00:00Z', id:"1", contributorId:"1"},
    { name: 'Understanding Docker Concepts', topic: 'Containers', date: '2020-07-23T00:00:00Z', id:"2", contributorId:"2"},
    { name: 'Linting in Node.js using ESLint', topic: 'Node.js', date: '2020-08-24T00:00:00Z', id:"3", contributorId:"2"},
    { name: 'REST APIs - Introductory guide', topic: 'API', date: '2020-06-26T00:00:00Z', id:"4", contributorId:"1"},
  ];
  
  let contributors = [
    { name: 'John Doe', url: '/john-doe', major: 'Computer Science', id:"1"},
    { name: 'Jane Doe', url: '/jane-doe', major: 'Physics', id:"2"},
];
  
const ArticleType = new GraphQLObjectType({
    name: 'Article',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        topic: { type: GraphQLString },
        date: { type: GraphQLString },
        contributorId: { type: GraphQLID },
        contributor:{
            type: ContributorType,
            resolve(parent,args){
                return _.find(contributors,{id:parent.contributorId})
            }
        }
    })
});

const ContributorType = new GraphQLObjectType({
    name: 'Contributor',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        url: { type: GraphQLString },
        major: { type: GraphQLString },
        articles:{
            type: new GraphQLList(ArticleType),
            resolve(parent,args){
                return _.filter(articles, {contributorId:parent.id})
            }
        }
    })
});

//route Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        article: {
            type: ArticleType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(articles, { 'id': args.id })
            }
        },
        contributor: {
            type: ContributorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(contributors, { 'id': args.id })
            }
        }
    }
});

module.exports = new GraphQLSchema({
    //The GraphQLSchema takes an object with key-value pairs. One key is query. To this key, pass the above created RootQuery as a value. 
    query: RootQuery,
});