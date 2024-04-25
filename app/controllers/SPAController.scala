package controllers

import javax.inject._
import play.api.mvc._

@Singleton
class SPAController @Inject() (cc: ControllerComponents)
    extends AbstractController(cc) {
  def index(path: String): Action[AnyContent] = Action {
    implicit request: Request[AnyContent] =>
      Ok(views.html.index())
  }
}
