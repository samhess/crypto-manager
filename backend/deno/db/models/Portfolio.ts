import { denodb } from '../../deps.ts'
import Coin from './Coin.ts'
import User from './User.ts'
const { DataTypes, Model, Relationships } = denodb

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