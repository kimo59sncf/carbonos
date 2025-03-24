const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SharedDocument = sequelize.define('SharedDocument', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    documentType: {
      type: DataTypes.ENUM('report', 'emissions', 'action_plan'),
      allowNull: false,
      comment: 'Type de document partagé'
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'ID du document partagé'
    },
    sharedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Utilisateur ayant partagé le document'
    },
    sharedWith: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Utilisateur avec qui le document est partagé'
    },
    accessLevel: {
      type: DataTypes.ENUM('view', 'edit'),
      allowNull: false,
      defaultValue: 'view',
      comment: 'Niveau d\'accès accordé'
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date d\'expiration du partage'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    accessCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Nombre d\'accès au document'
    },
    lastAccessedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    paranoid: true, // Soft delete
    indexes: [
      {
        fields: ['documentType', 'documentId']
      },
      {
        fields: ['sharedBy']
      },
      {
        fields: ['sharedWith']
      }
    ]
  });

  // Associations à définir dans index.js
  SharedDocument.associate = (models) => {
    SharedDocument.belongsTo(models.User, { foreignKey: 'sharedBy', as: 'owner' });
    SharedDocument.belongsTo(models.User, { foreignKey: 'sharedWith', as: 'recipient' });
  };

  return SharedDocument;
};
