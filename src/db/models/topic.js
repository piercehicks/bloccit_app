'use strict';
module.exports = (sequelize, DataTypes) => {
  const Topic = sequelize.define('Topic', {
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Topic.associate = function(models){
   Topic.hasMany(models.Rule, {
     foreignKey: "topicId",
     as: "rules"
   });
 }
  Topic.associate = function(models) {
    // associations can be defined here
    Topic.hasMany(models.Banner, {
    foreignKey: "topicId",
    as: "banners",
  });
  };
  return Topic;
};
