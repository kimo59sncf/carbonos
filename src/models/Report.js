const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Report = sequelize.define('Report', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    emissionDataId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('beges', 'csrd', 'carbon', 'custom'),
      allowNull: false,
      comment: 'Type de rapport (BEGES, CSRD, Bilan Carbone, personnalisé)'
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Période couverte par le rapport (ex: "2024", "Q1 2024")'
    },
    format: {
      type: DataTypes.ENUM('pdf', 'xbrl', 'excel', 'csv'),
      allowNull: false,
      defaultValue: 'pdf'
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Chemin vers le fichier généré'
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Taille du fichier en octets'
    },
    generatedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Utilisateur ayant généré le rapport'
    },
    totalEmissions: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'Total des émissions dans le rapport en tCO2e'
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Métadonnées supplémentaires du rapport'
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Indique si le rapport est public'
    },
    publicUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'URL publique du rapport si partagé'
    },
    publicExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date d\'expiration du lien public'
    }
  }, {
    timestamps: true,
    paranoid: true, // Soft delete
    indexes: [
      {
        fields: ['companyId']
      },
      {
        fields: ['emissionDataId']
      },
      {
        fields: ['type']
      }
    ]
  });

  // Associations à définir dans index.js
  Report.associate = (models) => {
    Report.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
    Report.belongsTo(models.EmissionData, { foreignKey: 'emissionDataId', as: 'emissionData' });
    Report.belongsTo(models.User, { foreignKey: 'generatedBy', as: 'generator' });
    Report.hasMany(models.SharedDocument, { foreignKey: 'documentId', as: 'shares', scope: { documentType: 'report' } });
  };

  return Report;
};
