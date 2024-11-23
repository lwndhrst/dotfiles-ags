{
  inputs = {
    nixpkgs = {
      url = "github:nixos/nixpkgs/nixos-unstable";
    };

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, ags }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
        overlays = [ ];
      };

    in {
      packages.${system}.default = ags.lib.bundle {
        inherit pkgs;
        name = "ags-run";
        src = ./ags;

        extraPackages = with ags.packages.${system}; [
          hyprland
          tray
        ];
      };
    };
}
