package dao

import javax.inject.{Inject, Singleton}
import scala.concurrent.{ExecutionContext, Future}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.JdbcProfile
import models.Candlestick

@Singleton
class CandlestickDao @Inject() (
    protected val dbConfigProvider: DatabaseConfigProvider
)(implicit ec: ExecutionContext)
    extends HasDatabaseConfigProvider[JdbcProfile] {

  import profile.api._

  private class CandlestickTable(tag: Tag)
      extends Table[Candlestick](tag, "candlesticks") {
    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
    def pairId = column[Long]("pair_id")
    def open = column[BigDecimal]("open")
    def high = column[BigDecimal]("high")
    def low = column[BigDecimal]("low")
    def close = column[BigDecimal]("close")
    def volume = column[BigDecimal]("volume")
    def timeframe = column[String]("timeframe")
    def time = column[java.sql.Timestamp]("time")

    def * = (
      id.?,
      pairId,
      open,
      high,
      low,
      close,
      volume,
      timeframe,
      time
    ) <> ((Candlestick.apply _).tupled, Candlestick.unapply)
  }

  private val candlesticks = TableQuery[CandlestickTable]

  def findAll(): Future[Seq[Candlestick]] = db.run(candlesticks.result)
}
