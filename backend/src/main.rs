use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use serde::Deserialize;
use serde_json::{json, Map, Value};
use std::fs;

fn toFileJson(name: String) -> String {
    // Create an empty JSON object
    let mut object = Map::new();

    // Add key-value pairs to the object
    object.insert("name".to_string(), Value::String(name));
    object.insert(
        "Number Ex".to_string(),
        Value::Number(serde_json::Number::from(30)),
    );
    object.insert("Boolean Ex".to_string(), Value::Bool(true));

    // Serialize the object to a JSON string
    json!(object).to_string()
}

fn toJsonArray(data: Vec<String>) -> String {
    // Serialize the vector to a JSON string
    json!(data).to_string()
}

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Notii Backend running...")
}

#[derive(Debug, serde::Deserialize)]
pub struct FilesystemQueryParams {
    path: String,
}

#[get("/files")]
async fn filesystem(query: web::Query<FilesystemQueryParams>) -> impl Responder {
    let path = &query.path;
    println!("/files :: received q? :: {}", path.to_string());

    let mut error = String::new();
    let mut success = true;
    let mut files: Vec<String> = vec![];
    if let Ok(entries) = fs::read_dir(path) {
        for entry in entries {
            if let Ok(entry) = entry {
                if let Some(name) = entry.file_name().to_str() {
                    files.push(toFileJson(name.to_string()))
                }
            }
        }
    } else {
        success = false;
        error.push_str(format!("Failed to read directory").as_str());
    }

    let mut response = Map::new();
    response.insert("data".to_string(), Value::String(json!(files).to_string()));
    response.insert("success".to_string(), Value::Bool(success));
    response.insert("error".to_string(), Value::String(error));

    HttpResponse::Ok().body(json!(response).to_string())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().service(hello).service(filesystem))
        .bind("127.0.0.1:8080")?
        .run()
        .await
}
