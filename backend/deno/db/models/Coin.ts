import { denodb } from '../../deps.ts'
const { DataTypes, Model } = denodb

class Coin extends Model {
  static table = 'coins'

  static timestamps = false

  static fields = {
    id: { 
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false
    },
    symbol: DataTypes.STRING,
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    ranking: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    change1h: DataTypes.FLOAT,
    change24h: DataTypes.FLOAT,
    change7d: DataTypes.FLOAT,
    volume24h: {
      type: DataTypes.FLOAT,
      precision: 20,
      scale: 2
    },
    marketcap: {
      type: DataTypes.FLOAT,
      precision: 20,
      scale: 2
    }
  }
}

export default Coin