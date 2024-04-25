package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import scala.concurrent.ExecutionContext.Implicits.global
import models.Candlestick // Assuming your model class is Candlestick
import dao.CandlestickDao // Assuming your DAO class is CandlestickDao

@Singleton
class HomeController @Inject() (
    cc: ControllerComponents,
    candlestickDao: CandlestickDao
) extends AbstractController(cc) {

  def index() = Action { implicit request: Request[AnyContent] =>
    Ok("Your new application is ready.")
  }

  // Assuming a model and DAO are already defined
  def getCandlestickData = Action.async { implicit request =>
    candlestickDao.findAll().map { candlesticks =>
      Ok(Json.toJson(candlesticks))
    }
  }
}
