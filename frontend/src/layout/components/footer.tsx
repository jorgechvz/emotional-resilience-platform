import { Separator } from "@/components/ui/separator";
import {
  DribbbleIcon,
  GithubIcon,
  TwitchIcon,
  TwitterIcon,
} from "lucide-react";
import { Logo } from "./logo";
import { Link } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";

const Footer = () => {
  const { t } = useTranslation();
  
  const footerLinks = [
    {
      title: t("footer.links.about"),
      href: "/about",
    },
    {
      title: t("footer.links.findGroups"),
      href: "/resilience-circles",
    },
    {
      title: t("footer.links.courses"),
      href: "/courses",
    },
    {
      title: t("footer.links.stories"),
      href: "/stories",
    },
    {
      title: t("footer.links.privacy"),
      href: "/privacy",
    },
    {
      title: t("footer.links.terms"),
      href: "/terms",
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="grow bg-muted" />
      <footer>
        <div className="max-w-screen-xl mx-auto">
          <div className="py-12 flex flex-col justify-start items-center">
            {/* Logo */}
            <Logo size="xl"/>

            <ul className="mt-6 flex items-center gap-4 flex-wrap justify-center">
              {footerLinks.map(({ title, href }) => (
                <li key={title}>
                  <Link
                    to={href}
                    className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Church Notice */}
            <div className="mt-8 max-w-2xl text-center">
              <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4 border border-border/50">
                {t("footer.churchNotice")}
              </p>
              
            </div>
          </div>
          
          <Separator />
          
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            {/* Copyright */}
            <div className="text-muted-foreground text-sm text-center sm:text-left">
              <p>
                &copy; {new Date().getFullYear()}{" "}
                <span className="font-medium">Resilire</span>
                . {t("footer.copyright")}
              </p>
              <p className="mt-1">
                {t("footer.platformBy")}{" "}
                <Link 
                  to="/about" 
                  className="hover:text-foreground transition-colors font-medium"
                >
                  Jorge A Chavez
                </Link>
              </p>
            </div>

            <div className="flex items-center gap-5 text-muted-foreground">
              <Link 
                to="#" 
                target="_blank"
                className="hover:text-foreground transition-colors"
              >
                <TwitterIcon className="h-5 w-5" />
              </Link>
              <Link 
                to="#" 
                target="_blank"
                className="hover:text-foreground transition-colors"
              >
                <DribbbleIcon className="h-5 w-5" />
              </Link>
              <Link 
                to="#" 
                target="_blank"
                className="hover:text-foreground transition-colors"
              >
                <TwitchIcon className="h-5 w-5" />
              </Link>
              <Link 
                to="#" 
                target="_blank"
                className="hover:text-foreground transition-colors"
              >
                <GithubIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;