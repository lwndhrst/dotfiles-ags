{
  inputs = {
    nixpkgs = {
      url = "github:nixos/nixpkgs/nixos-unstable";
    };

    astal = {
      url = "github:aylur/astal";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, astal, ags }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
        overlays = [ ];
      };

    in {
      packages.${system}.default = pkgs.stdenvNoCC.mkDerivation rec {
        name = "ags";
        src = ./.;

        nativeBuildInputs = [
          ags.packages.${system}.default
          pkgs.wrapGAppsHook
          pkgs.gobject-introspection
        ];

        buildInputs = (with astal.packages.${system}; [
          astal3
          io
          hyprland
          mpris
          battery
          wireplumber
          network
          tray
        ]) ++ (with pkgs; [
          libdbusmenu-gtk3
        ]);

        installPhase = ''
          mkdir -p $out/bin
          cd ags
          ags bundle app.ts $out/bin/${name}
        '';
      };
    };
}
