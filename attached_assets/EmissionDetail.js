const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EmissionDetail = sequelize.define('EmissionDetail', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    emissionDataId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('fuel_consumption', 'company_vehicles', 'refrigerant_leaks', 'electricity_consumption', 'heat_consumption', 'business_travel', 'employee_commuting', 'purchased_goods', 'waste_disposal', 'freight_transport'),
      allowNull: false
    },
    scope: {
      type: DataTypes.ENUM('scope1', 'scope2', 'scope3'),
      allowNull: false
    },
    sourceType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Type de source (ex: "diesel", "electricity", "plane")'
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Unité de mesure (ex: "litres", "kWh", "km")'
    },
    emissionFactor: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: 'Facteur d\'émission en kgCO2e par unité'
    },
    emissionFactorSource: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'ADEME',
      comment: 'Source du facteur d\'émission'
    },
    emissions: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: 'Émissions calculées en tCO2e'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dataQuality: {
      type: DataTypes.ENUM('high', 'medium', 'low'),
      allowNull: true,
      comment: 'Qualité des données'
    },
    isEstimated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Indique si les données sont estimées'
    }
  }, {
    timestamps: true,
    paranoid: true, // Soft delete
    indexes: [
      {
        fields: ['emissionDataId']
      },
      {
        fields: ['category']
      },
      {
        fields: ['scope']
      }
    ]
  });

  // Associations à définir dans index.js
  EmissionDetail.associate = (models) => {
    EmissionDetail.belongsTo(models.EmissionData, { foreignKey: 'emissionDataId', as: 'emissionData' });
  };

  return EmissionDetail;
};
