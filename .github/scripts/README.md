# Helper Scripts in `.github/scripts`

These scripts are legacy build/install helpers primarily used by CI to prepare dependencies for `hevm` and related tooling when not using Nix. They install binaries into `$HOME/.local` and assume a Unix-like environment with `bash`, `curl`/`wget`, and build tools available. If you are using Nix or prebuilt releases, you normally **do not need to run these manually**.

## Common notes
- Expected env vars: `HOST_OS` set to `Linux` or `macOS`. Some scripts also source `host.sh` to derive `$PREFIX` (defaults to `$HOME/.local`) and the platform-specific library extension (`.a` or `.dylib`).
- Installation prefix: `$HOME/.local` for binaries and libraries.
- Safety: Most scripts are idempotent and skip work if the artifact already exists.
- Prereqs: `git`, `curl`/`wget`, `unzip`, `cmake`, `autoconf`, `automake`, `libtool`, and a C/C++ toolchain. macOS builds may also need Homebrew OpenSSL headers.

## Script catalog

### `host.sh`
Sets `$PREFIX` (default `$HOME/.local`) and the library extension (`$EXT`) based on `HOST_OS`. Source this before running the other library build scripts.

### `install-solc.sh`
Downloads a static `solc` binary (default v0.8.6, override with `SOLC_VER`) for Linux or macOS into `$HOME/.local/bin/solc-<version>`. Useful when you need a specific compiler version outside Nix.

### `install-z3.sh`
Fetches Z3 4.8.10 for Linux (Ubuntu 18.04 build) or macOS, placing the `z3` binary in `$HOME/.local/bin`. Required for `hevm` symbolic execution if you are not using the Nix-provided Z3.

### `install-cvc4.sh`
Downloads CVC4 1.8 for Linux or macOS into `$HOME/.local/bin/cvc4`. Optional SMT solver alternative for `hevm` symbolic execution.

### `install-libff.sh`
Builds and installs `libff` v0.2.1 from source into `$PREFIX` (defaults to `$HOME/.local`). Needed for `hevm` when building from source without Nix. On macOS it tweaks CMakeLists to build shared libs and sets OpenSSL include/library paths.

### `install-libsecp256k1.sh`
Builds and installs `libsecp256k1` (commit `1086fda4c`) into `$PREFIX` with recovery module and PIC enabled. Required by `hevm` when not using Nix or prebuilt releases.

### `build-macos-release.sh`
Mac-only helper that repackages the `hevm` binary from `$HOME/.local/bin` into a relocatable tarball (`hevm.tar.gz`), adjusting rpaths and bundling `libff`/`libsecp256k1` (and their `libgmp` deps). Used for producing macOS release artifacts.

## When should you run these?
- **Running under Nix?** Probably never—Nix builds provide all dependencies.
- **Using prebuilt hevm releases?** Skip these; solvers and libs are included or fetched separately.
- **Manual/non-Nix build of hevm:**
  - Run `install-libff.sh` and `install-libsecp256k1.sh` first (after exporting `HOST_OS`).
  - Install at least one solver: `install-z3.sh` (and optionally `install-cvc4.sh`).
  - Optionally fetch a specific compiler with `install-solc.sh`.
  - On macOS, use `build-macos-release.sh` to bundle a relocatable tarball after building `hevm`.

## Quick start example (Linux, non-Nix)
```bash
export HOST_OS=Linux
bash .github/scripts/install-libff.sh
bash .github/scripts/install-libsecp256k1.sh
bash .github/scripts/install-z3.sh
# Optional
SOLC_VER=0.8.20 bash .github/scripts/install-solc.sh
```

If you only use the Nix workflows in this repository, you can safely ignore these scripts.
