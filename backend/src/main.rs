use actix_cors::Cors;
use actix_web::middleware::Logger;
use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use env_logger;
use serde::Serialize;
use std::fs;

#[derive(Serialize)]
struct FileData {
    filename: String,
    filepath: String,
    hidden: bool,
    is_dir: bool,
    is_symlink: bool,
}

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Notii Backend running...")
}

#[derive(Debug, serde::Deserialize)]
pub struct FilesystemQueryParams {
    path: String,
}

#[derive(Serialize)]
struct ResponseData {
    success: bool,
    data: Vec<FileData>,
    error: String,
}

#[get("/data")]
async fn filesystem(query: web::Query<FilesystemQueryParams>) -> impl Responder {
    let path = &query.path;
    println!("/data :: received q? :: {}", path.to_string());

    let mut error = String::new();
    let mut success = true;
    let mut data: Vec<FileData> = vec![];
    if let Ok(entries) = fs::read_dir(path) {
        for entry in entries {
            if let Ok(entry) = entry {
                let mut filename = String::new();
                if let Some(name) = entry.file_name().to_str() {
                    filename = name.to_string();
                }
                let mut filepath = String::new();
                if let Some(path) = entry.path().to_str() {
                    filepath = path.to_string();
                }
                let is_hidden_file = filename.starts_with(".");

                data.push(FileData {
                    filename,
                    filepath,
                    hidden: is_hidden_file,
                    is_dir: entry.file_type().unwrap().is_dir(),
                    is_symlink: entry.file_type().unwrap().is_symlink(),
                });
            }
        }
    } else {
        success = false;
        error.push_str(format!("Failed to read directory").as_str());
    }

    let response_data = ResponseData {
        success,
        data,
        error,
    };
    let response_json = serde_json::to_string(&response_data).unwrap();
    HttpResponse::Ok()
        .content_type("application/json")
        .body(response_json)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("starting server on port: {}", "8080");
    env_logger::init();

    HttpServer::new(|| {
        // TODO we need to make these secure
        // this is for DEVELOPMENT only
        let cors = Cors::default()
            .allow_any_origin()
            .allowed_headers(vec![
                "Authorization",
                "Accept",
                "Access-Control-Allow-Origin",
            ])
            .allowed_methods(vec!["GET", "POST"])
            .max_age(3600);
        App::new()
            .wrap(cors)
            .wrap(Logger::default())
            .service(hello)
            .service(filesystem)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
