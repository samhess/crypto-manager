import { DataTypes, Model } from 'https://deno.land/x/denodb/mod.ts'

class Coin extends Model {
  static table = 'coins'

  static timestamps = false

  static fields = {
    id: { 
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    symbol: DataTypes.STRING,
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    ranking: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    change1h: DataTypes.FLOAT,
    change24h: DataTypes.FLOAT,
    change7d: DataTypes.FLOAT,
    volume24h: DataTypes.FLOAT,
    marketcap: DataTypes.FLOAT,
  }
}

export default Coin