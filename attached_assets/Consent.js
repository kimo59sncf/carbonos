const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Consent = sequelize.define('Consent', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('terms', 'data_processing', 'marketing', 'cookies', 'third_party'),
      allowNull: false,
      comment: 'Type de consentement'
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Version du document de consentement'
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      comment: 'Statut du consentement (accepté ou refusé)'
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date d\'expiration du consentement'
    }
  }, {
    timestamps: true,
    updatedAt: false, // Les consentements ne sont pas mis à jour, on crée de nouvelles entrées
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['type']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  // Associations à définir dans index.js
  Consent.associate = (models) => {
    Consent.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Consent;
};
