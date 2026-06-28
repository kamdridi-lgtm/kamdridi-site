type IronCountyGhostsLogoProps = {
  className?: string;
};

export function IronCountyGhostsLogo({ className = "" }: IronCountyGhostsLogoProps) {
  return (
    <img
      src="/assets/images/label/iron-county-ghosts/iron-county-ghosts-logo.png?v=3"
      alt="IRON COUNTY GHOSTS"
      className={`h-auto w-full object-contain object-center mix-blend-screen ${className}`}
    />
  );
}
