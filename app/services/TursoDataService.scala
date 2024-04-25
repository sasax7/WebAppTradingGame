package services

import play.api.libs.ws.WSClient
import scala.concurrent.{Future, ExecutionContext}
import play.api.libs.json.JsValue
import javax.inject.Inject

class TursoDataService @Inject() (ws: WSClient)(implicit ec: ExecutionContext) {
  val apiUrl =
    "libsql://webapp-sasax7.turso.io" // Adjusted to a hypothetical HTTP endpoint
  val token =
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MTQwMjcxNTAsImlkIjoiMjQ4ZjQyZWYtZjZkOS00ZjgwLTk2MjEtMDVmYzE3YTgxNGM2In0.1Fj5q55tNKGTwu906-NpS3Bl5jbG7IPQ1cYYI5RkNxptebxhUQmfRfXiQlxIuA9z42duJavhd9fdKTFCGAASDg"

  def fetchData(): Future[JsValue] = {
    ws.url(apiUrl)
      .addHttpHeaders("Authorization" -> s"Bearer $token")
      .get()
      .map { response =>
        // Assuming the response is JSON and you want to return it as is
        response.json
      }
  }
}
