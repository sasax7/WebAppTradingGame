package models

import play.api.libs.json._
import java.sql.Timestamp

object JsonFormatters {
  implicit val timestampFormat: Format[Timestamp] = new Format[Timestamp] {
    def writes(ts: Timestamp): JsValue = JsNumber(ts.getTime)
    def reads(json: JsValue): JsResult[Timestamp] = json match {
      case JsNumber(ts) => JsSuccess(new Timestamp(ts.toLong))
      case _            => JsError("Expected timestamp as JsNumber")
    }
  }
}
