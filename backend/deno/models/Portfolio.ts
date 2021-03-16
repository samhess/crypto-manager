import { DataTypes, Model, Relationships } from 'https://deno.land/x/denodb/mod.ts'
import Coin from "../models/Coin.ts"
import User from "../models/User.ts"

class Portfolio extends Model {
  static table = 'portfolio'

  static timestamps = false

  static fields = {
    id: { 
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userid: Relationships.belongsTo(User),
    coinid: Relationships.belongsTo(Coin),
    amount: {
      type: DataTypes.FLOAT
    }
  }
}

export default Portfolio