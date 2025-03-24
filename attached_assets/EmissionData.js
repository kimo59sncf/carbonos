const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EmissionData = sequelize.define('EmissionData', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    reportingPeriod: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Période de reporting (ex: "2024", "Q1 2024")'
    },
    reportingYear: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    scope1Total: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
      comment: 'Total des émissions scope 1 en tCO2e'
    },
    scope2Total: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
      comment: 'Total des émissions scope 2 en tCO2e'
    },
    scope3Total: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
      comment: 'Total des émissions scope 3 en tCO2e'
    },
    totalEmissions: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
      comment: 'Total des émissions tous scopes en tCO2e'
    },
    status: {
      type: DataTypes.ENUM('draft', 'submitted', 'validated', 'archived'),
      defaultValue: 'draft'
    },
    submittedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Utilisateur ayant soumis les données'
    },
    validatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Utilisateur ayant validé les données'
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    validatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dataSource: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Source des données (ex: "manual", "import", "api")'
    },
    methodologyNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    emissionFactorsVersion: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Version des facteurs d\'émission utilisés'
    }
  }, {
    timestamps: true,
    paranoid: true, // Soft delete
    indexes: [
      {
        fields: ['companyId']
      },
      {
        fields: ['reportingYear']
      }
    ]
  });

  // Associations à définir dans index.js
  EmissionData.associate = (models) => {
    EmissionData.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
    EmissionData.hasMany(models.EmissionDetail, { foreignKey: 'emissionDataId', as: 'details' });
    EmissionData.hasMany(models.Report, { foreignKey: 'emissionDataId', as: 'reports' });
    EmissionData.belongsTo(models.User, { foreignKey: 'submittedBy', as: 'submitter' });
    EmissionData.belongsTo(models.User, { foreignKey: 'validatedBy', as: 'validator' });
  };

  return EmissionData;
};
