const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    siret: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^\d{14}$/
      }
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sectorCode: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Code NAF/CNAE'
    },
    employeeCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'France'
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    contactPhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    subscriptionType: {
      type: DataTypes.ENUM('freemium', 'premium_pme', 'premium_eti'),
      defaultValue: 'freemium'
    },
    subscriptionExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    paranoid: true, // Soft delete
    indexes: [
      {
        unique: true,
        fields: ['siret']
      }
    ]
  });

  // Associations à définir dans index.js
  Company.associate = (models) => {
    Company.hasMany(models.User, { foreignKey: 'companyId', as: 'users' });
    Company.hasMany(models.EmissionData, { foreignKey: 'companyId', as: 'emissionData' });
    Company.hasMany(models.Report, { foreignKey: 'companyId', as: 'reports' });
  };

  return Company;
};
