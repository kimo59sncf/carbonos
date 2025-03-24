import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function RgpdPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("compliance");
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  
  const handleDataExport = async () => {
    try {
      const res = await apiRequest("GET", "/api/rgpd/export-data");
      const data = await res.json();
      
      // Create a JSON blob and download it
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'mes-donnees-carbonos.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export réussi",
        description: "Vos données ont été exportées avec succès.",
      });
      
      setExportDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Une erreur est survenue lors de l'export de vos données.",
        variant: "destructive",
      });
    }
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">RGPD</h1>
            <p className="text-neutral-500">Gestion de la conformité et de vos données personnelles</p>
          </div>
        </div>
      </div>

      <Alert className="mb-6 border-primary-200 bg-primary-50">
        <i className="fas fa-shield-alt text-primary-500 mr-2"></i>
        <AlertTitle>Protection des données</AlertTitle>
        <AlertDescription>
          CarbonOS est conçu pour être conforme au RGPD. Vous pouvez à tout moment exercer vos droits sur vos données personnelles.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <Tabs defaultValue="compliance" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="compliance">Conformité</TabsTrigger>
              <TabsTrigger value="registry">Registre des traitements</TabsTrigger>
              <TabsTrigger value="mydata">Mes données</TabsTrigger>
              <TabsTrigger value="consents">Consentements</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <TabsContent value="compliance" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Statut de conformité RGPD</h3>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-neutral-600">Statut global</span>
                    <span className="text-success font-medium">90%</span>
                  </div>
                  <Progress value={90} className="h-2 bg-neutral-200" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <i className="fas fa-check-circle text-success mr-2"></i>
                      <span>Consentements utilisateurs</span>
                    </div>
                    <span className="text-sm text-neutral-500">Complété</span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <i className="fas fa-check-circle text-success mr-2"></i>
                      <span>Registre des traitements</span>
                    </div>
                    <span className="text-sm text-neutral-500">Complété</span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <i className="fas fa-check-circle text-success mr-2"></i>
                      <span>Procédure de violation</span>
                    </div>
                    <span className="text-sm text-neutral-500">Complété</span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <i className="fas fa-exclamation-circle text-warning mr-2"></i>
                      <span>Analyse d'impact (PIA)</span>
                    </div>
                    <span className="text-sm text-neutral-500">À compléter</span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <i className="fas fa-check-circle text-success mr-2"></i>
                      <span>Désignation d'un DPO</span>
                    </div>
                    <span className="text-sm text-neutral-500">Complété</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Actions recommandées</h3>
                
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-warning bg-opacity-20 flex items-center justify-center text-warning">
                          <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-base font-medium">Compléter l'analyse d'impact (PIA)</h4>
                          <p className="text-sm text-neutral-500 mt-1">L'analyse d'impact relative à la protection des données est requise pour les traitements susceptibles d'engendrer un risque élevé pour les droits et libertés des personnes.</p>
                          <Button variant="outline" size="sm" className="mt-3">
                            <i className="fas fa-arrow-right mr-1"></i> Commencer l'analyse
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                          <i className="fas fa-sync-alt"></i>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-base font-medium">Révision annuelle du registre des traitements</h4>
                          <p className="text-sm text-neutral-500 mt-1">La CNIL recommande de réviser votre registre des traitements au moins une fois par an.</p>
                          <Button variant="outline" size="sm" className="mt-3">
                            <i className="fas fa-arrow-right mr-1"></i> Réviser le registre
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="registry" className="mt-4">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Registre des activités de traitement</h3>
              <p className="text-sm text-neutral-500">
                Conformément à l'article 30 du RGPD, vous devez tenir un registre des activités de traitement de données personnelles.
              </p>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex flex-col sm:flex-row sm:items-center text-left w-full">
                    <span className="font-medium mr-4">Gestion des comptes utilisateurs</span>
                    <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1 mt-1 sm:mt-0">Données d'identification</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-600">Finalité</p>
                        <p className="text-sm">Permettre l'accès et l'utilisation de la plateforme</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-600">Base légale</p>
                        <p className="text-sm">Exécution du contrat</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Catégories de données</p>
                      <p className="text-sm">Données d'identification, données de connexion</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-600">Durée de conservation</p>
                        <p className="text-sm">Durée du contrat + 1 an</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-600">Destinataires</p>
                        <p className="text-sm">Personnel autorisé de CarbonOS</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Mesures de sécurité</p>
                      <p className="text-sm">Authentification, chiffrement, contrôle d'accès</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <div className="flex flex-col sm:flex-row sm:items-center text-left w-full">
                    <span className="font-medium mr-4">Calcul de l'empreinte carbone</span>
                    <span className="text-xs bg-green-100 text-green-800 rounded-full px-2 py-1 mt-1 sm:mt-0">Données d'activité</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-600">Finalité</p>
                        <p className="text-sm">Mesurer et suivre les émissions de gaz à effet de serre</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-600">Base légale</p>
                        <p className="text-sm">Exécution du contrat</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Catégories de données</p>
                      <p className="text-sm">Données d'activité, données financières</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-600">Durée de conservation</p>
                        <p className="text-sm">5 ans (obligation légale)</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-600">Destinataires</p>
                        <p className="text-sm">Personnel autorisé de l'entreprise cliente</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Mesures de sécurité</p>
                      <p className="text-sm">Chiffrement, contrôle d'accès, journalisation</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  <div className="flex flex-col sm:flex-row sm:items-center text-left w-full">
                    <span className="font-medium mr-4">Génération de rapports réglementaires</span>
                    <span className="text-xs bg-purple-100 text-purple-800 rounded-full px-2 py-1 mt-1 sm:mt-0">Données d'entreprise</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-600">Finalité</p>
                        <p className="text-sm">Produire des rapports conformes aux exigences légales</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-600">Base légale</p>
                        <p className="text-sm">Obligation légale, exécution du contrat</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Catégories de données</p>
                      <p className="text-sm">Données d'émissions, données d'entreprise</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-600">Durée de conservation</p>
                        <p className="text-sm">5 ans (obligation légale)</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-600">Destinataires</p>
                        <p className="text-sm">Personnel autorisé, autorités réglementaires</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Mesures de sécurité</p>
                      <p className="text-sm">Chiffrement, contrôle d'accès, journalisation</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  <div className="flex flex-col sm:flex-row sm:items-center text-left w-full">
                    <span className="font-medium mr-4">Benchmarking sectoriel</span>
                    <span className="text-xs bg-orange-100 text-orange-800 rounded-full px-2 py-1 mt-1 sm:mt-0">Données anonymisées</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-600">Finalité</p>
                        <p className="text-sm">Comparer les performances avec d'autres entreprises du secteur</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-600">Base légale</p>
                        <p className="text-sm">Intérêt légitime</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Catégories de données</p>
                      <p className="text-sm">Données d'émissions anonymisées</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-600">Durée de conservation</p>
                        <p className="text-sm">3 ans</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-600">Destinataires</p>
                        <p className="text-sm">Personnel autorisé (données agrégées uniquement)</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Mesures de sécurité</p>
                      <p className="text-sm">Anonymisation, agrégation, contrôle d'accès</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="mt-6">
              <Button>
                <i className="fas fa-plus mr-2"></i> Ajouter un traitement
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="mydata" className="mt-4">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Mes données personnelles</h3>
              <p className="text-sm text-neutral-500">
                Conformément au RGPD, vous pouvez exercer vos droits sur vos données personnelles à tout moment.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium flex items-center">
                    <i className="fas fa-download text-primary-500 mr-2"></i>
                    Droit à la portabilité
                  </CardTitle>
                  <CardDescription>
                    Exportez vos données dans un format structuré
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 mb-4">
                    Vous pouvez télécharger l'ensemble de vos données personnelles dans un format standard (JSON).
                  </p>
                </CardContent>
                <CardFooter>
                  <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <i className="fas fa-download mr-2"></i> Exporter mes données
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Exporter mes données</DialogTitle>
                        <DialogDescription>
                          Vous êtes sur le point d'exporter l'ensemble de vos données personnelles. Le fichier généré sera au format JSON.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-sm text-neutral-500 mb-4">
                          Les données exportées incluent :
                        </p>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>Vos informations de profil</li>
                          <li>Vos activités sur la plateforme</li>
                          <li>Vos préférences et paramètres</li>
                          <li>Vos consentements</li>
                        </ul>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setExportDialogOpen(false)}>Annuler</Button>
                        <Button onClick={handleDataExport}>Confirmer l'export</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium flex items-center">
                    <i className="fas fa-eraser text-red-500 mr-2"></i>
                    Droit à l'effacement
                  </CardTitle>
                  <CardDescription>
                    Supprimez vos données personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 mb-4">
                    Vous pouvez demander la suppression de vos données personnelles. Attention, cette action est irréversible.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                    <i className="fas fa-trash-alt mr-2"></i> Demander la suppression
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium flex items-center">
                    <i className="fas fa-history text-secondary-500 mr-2"></i>
                    Historique des demandes RGPD
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type de demande</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Accès aux données</TableCell>
                        <TableCell>15/05/2023</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 text-xs font-medium bg-success bg-opacity-10 text-success rounded-full">
                            Complété
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <i className="fas fa-eye mr-1"></i> Détails
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="consents" className="mt-4">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Gestion des consentements</h3>
              <p className="text-sm text-neutral-500">
                Vous pouvez gérer vos consentements pour différentes utilisations de vos données personnelles.
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Préférences de consentement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="consent-essential">Cookies essentiels</Label>
                      <p className="text-sm text-neutral-500">
                        Nécessaires au fonctionnement du site (toujours actifs)
                      </p>
                    </div>
                    <Switch id="consent-essential" defaultChecked disabled />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="consent-analytics">Cookies analytiques</Label>
                      <p className="text-sm text-neutral-500">
                        Nous aident à comprendre comment vous utilisez notre site
                      </p>
                    </div>
                    <Switch id="consent-analytics" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="consent-marketing">Emails marketing</Label>
                      <p className="text-sm text-neutral-500">
                        Recevoir des informations sur nos produits et services
                      </p>
                    </div>
                    <Switch id="consent-marketing" />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="consent-benchmark">Benchmarking anonymisé</Label>
                      <p className="text-sm text-neutral-500">
                        Contribution aux statistiques sectorielles anonymisées
                      </p>
                    </div>
                    <Switch id="consent-benchmark" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Enregistrer mes préférences</Button>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Politique de confidentialité</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 mb-4">
                  Notre politique de confidentialité explique en détail comment nous traitons vos données personnelles.
                </p>
                <div className="bg-neutral-50 p-4 rounded-lg text-sm">
                  <p className="font-medium mb-2">Dernière mise à jour : 15/06/2023</p>
                  <p className="text-neutral-500">
                    Vous avez accepté notre politique de confidentialité le 20/06/2023.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">
                  <i className="fas fa-external-link-alt mr-2"></i> Consulter la politique de confidentialité
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
