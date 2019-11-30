module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    nome: DataTypes.STRING,
    login: DataTypes.STRING,
    senha: DataTypes.STRING,
    idioma: DataTypes.STRING,
  });

  return Usuario;
}