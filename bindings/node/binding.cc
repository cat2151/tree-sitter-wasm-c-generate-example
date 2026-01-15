#include <napi.h>

typedef struct TSLanguage TSLanguage;

extern "C" TSLanguage *tree_sitter_musical_notes();

// "tree_sitter_musical_notes_external_scanner_create" is not provided by
// generated code unless the grammar uses externals, so we define a stub.
extern "C" {
  void *tree_sitter_musical_notes_external_scanner_create() { return nullptr; }
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports["name"] = Napi::String::New(env, "musical_notes");
  auto language = (TSLanguage *)tree_sitter_musical_notes();
  exports["language"] = Napi::External<TSLanguage>::New(env, language);
  return exports;
}

NODE_API_MODULE(tree_sitter_musical_notes_binding, Init)
