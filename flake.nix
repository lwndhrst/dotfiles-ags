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
      packages.${system} = {
        default = self.packages.${system}.run;

        run = ags.lib.bundle {
          inherit pkgs;
          name = "ags-run";
          src = ./ags;

          extraPackages = with ags.packages.${system}; [
            apps
            hyprland
            network
            notifd
            tray
          ];
        };

        quit = pkgs.writeShellApplication {
          name = "ags-quit";
          runtimeInputs = [ ags.packages.${system}.default ];
          text = ''
            ags quit
          '';
        };

        app-launcher = pkgs.writeShellApplication {
          name = "ags-launcher";
          runtimeInputs = [ ags.packages.${system}.default ];
          text = ''
            ags toggle app-launcher
          '';
        };
      };

      devShells.${system}.default = pkgs.mkShell {
        buildInputs = [
          ags.packages.${system}.default
        ];
      };
    };
}
