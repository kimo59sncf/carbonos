import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

interface ConsentBannerProps {
  onAccept: () => void;
}

export function ConsentBanner({ onAccept }: ConsentBannerProps) {
  const [cookieDialogOpen, setCookieDialogOpen] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-neutral-200 p-4 z-50">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0 md:mr-6">
            <h3 className="text-lg font-bold text-neutral-800 mb-2">Vos données personnelles</h3>
            <p className="text-neutral-600 text-sm">
              CarbonOS est conforme au RGPD et protège vos données personnelles. Nous collectons uniquement les informations nécessaires au fonctionnement du service. Pour en savoir plus, consultez notre {" "}
              <a href="#" className="text-primary-500 hover:underline">politique de confidentialité</a>.
            </p>
          </div>
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-3">
            <Dialog key="cookie-dialog" open={cookieDialogOpen} onOpenChange={setCookieDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Paramétrer les cookies
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Paramètres des cookies</DialogTitle>
                  <DialogDescription>
                    Paramétrez vos préférences de confidentialité
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Cookies essentiels</h4>
                      <p className="text-sm text-neutral-500">Nécessaires au fonctionnement du site</p>
                    </div>
                    <div className="bg-neutral-200 px-2 py-1 rounded text-xs font-medium">Obligatoires</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Cookies analytiques</h4>
                      <p className="text-sm text-neutral-500">Aident à améliorer nos services</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Cookies marketing</h4>
                      <p className="text-sm text-neutral-500">Utilisés pour la personnalisation</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={() => {
                      setCookieDialogOpen(false);
                      onAccept();
                    }}
                  >
                    Enregistrer les préférences
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button onClick={onAccept}>
              Accepter et continuer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsentBanner;
