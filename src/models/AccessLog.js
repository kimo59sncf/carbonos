const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AccessLog = sequelize.define('AccessLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Action effectuée (ex: "login", "view_report", "export_data")'
    },
    resourceType: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Type de ressource concernée (ex: "user", "report", "emission_data")'
    },
    resourceId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'ID de la ressource concernée'
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Détails supplémentaires sur l\'action'
    },
    status: {
      type: DataTypes.ENUM('success', 'failure', 'warning'),
      allowNull: false,
      defaultValue: 'success'
    }
  }, {
    timestamps: true,
    updatedAt: false, // Pas besoin de mettre à jour les logs
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['action']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  // Associations à définir dans index.js
  AccessLog.associate = (models) => {
    AccessLog.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return AccessLog;
};
