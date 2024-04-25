name := """WebApp"""
organization := "com.example"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.13.13"

libraryDependencies ++= Seq(
  guice,
  ws, // This is the Play WS library
  "org.scalatestplus.play" %% "scalatestplus-play" % "7.0.0" % Test,
  "org.postgresql" % "postgresql" % "42.2.18",
  "com.typesafe.play" %% "play-slick" % "5.0.0",
  "com.typesafe.slick" %% "slick" % "3.3.3",
  "com.typesafe.slick" %% "slick-hikaricp" % "3.3.3",
  "com.typesafe.slick" %% "slick-codegen" % "3.3.3",
  "com.github.tminglei" %% "slick-pg" % "0.19.7",
  "org.scala-lang.modules" %% "scala-xml" % "2.2.0",
  "com.typesafe.play" %% "play-json" % "2.9.2"
)

dependencyOverrides += "org.scala-lang.modules" %% "scala-xml" % "2.2.0"

// Adds additional packages into Twirl
//TwirlKeys.templateImports += "com.example.controllers._"

// Adds additional packages into conf/routes
// play.sbt.routes.RoutesKeys.routesImport += "com.example.binders._"
