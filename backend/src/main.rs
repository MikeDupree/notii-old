use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use serde::Deserialize;
use std::fs;

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Notii Backend running...")
}

#[derive(Debug, serde::Deserialize)]
pub struct FilesystemQueryParams {
    #[serde(rename = "path")]
    path: String,
}

#[get("/files")]
async fn filesystem(
    query: web::Query<FilesystemQueryParams>,
) -> impl Responder {

    let path = &query.path;

    println!("/files :: received q? :: {}", path.to_string());
    let mut result = String::new();
    if let Ok(entries) = fs::read_dir(path) {
        
        for entry in entries {
            if let Ok(entry) = entry {
                if let Some(name) = entry.file_name().to_str() {
                    result.push_str(format!(" {} ", name).as_str());
                }
            }
        }
    } else {
        result.push_str(format!("Failed to read directory").as_str());
    }

    HttpResponse::Ok().body(result)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().service(hello).service(filesystem))
        .bind("127.0.0.1:8080")?
        .run()
        .await
}

