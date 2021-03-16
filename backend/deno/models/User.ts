import { DataTypes, Model } from 'https://deno.land/x/denodb/mod.ts'

class User extends Model {
  static table = 'users'

  static timestamps = false

  static fields = {
    id: { 
      type: DataTypes.INTEGER,
      primaryKey: true, 
      autoIncrement: true  
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.ENUM,
      values: ['user', 'admin']
    },
    status: {
      type: DataTypes.ENUM,
      values: ['enabled', 'disabled']
    }
  }

  static defaults = {
    role: 'user',
    status: 'enabled'
  };
}

export default User