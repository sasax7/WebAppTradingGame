package controllers

import javax.inject._
import play.api.mvc._

@Singleton
class SPAController @Inject() (cc: ControllerComponents)
    extends AbstractController(cc) {
  def index: Action[AnyContent] = Action {
    implicit request: Request[AnyContent] =>
      Ok(views.html.index())
  }
}

class HomeController @javax.inject.Inject() (cc: ControllerComponents)
    extends AbstractController(cc) {
  def index() = Action { implicit request: Request[AnyContent] =>
    Ok("Your new application is ready.")
  }
}
