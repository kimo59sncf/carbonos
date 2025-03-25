const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true // Peut être null si authentification OAuth
    },
    role: {
      type: DataTypes.ENUM('admin', 'editor', 'viewer'),
      defaultValue: 'viewer'
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    lastLogin: {
      type: DataTypes.DATE
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    consentMarketing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    consentDataProcessing: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    twoFactorSecret: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true,
    paranoid: true, // Soft delete
    indexes: [
      {
        unique: true,
        fields: ['email']
      }
    ]
  });

  // Associations à définir dans index.js
  User.associate = (models) => {
    User.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
    User.hasMany(models.AccessLog, { foreignKey: 'userId', as: 'accessLogs' });
    User.hasMany(models.Consent, { foreignKey: 'userId', as: 'consents' });
  };

  return User;
};
