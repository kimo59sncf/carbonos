import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Form schema for report creation
const reportFormSchema = z.object({
  companyId: z.number().optional(),
  name: z.string().min(1, "Le nom du rapport est requis"),
  type: z.string().min(1, "Le type de rapport est requis"),
  year: z.coerce.number().min(2000, "L'année doit être supérieure à 2000"),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

export default function ReportsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { data: reports, isLoading } = useQuery({
    queryKey: ["/api/reports"],
  });

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      companyId: user?.companyId || 1,
      name: "",
      type: "",
      year: new Date().getFullYear(),
    },
  });

  const createReportMutation = useMutation({
    mutationFn: async (data: ReportFormValues) => {
      return apiRequest("POST", "/api/reports", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      toast({
        title: "Rapport créé",
        description: "Le rapport a été créé avec succès.",
      });
      form.reset();
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le rapport.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReportFormValues) => {
    // Add companyId from the user if available
    const submissionData = {
      ...data,
      companyId: user?.companyId || 1,
    };
    
    createReportMutation.mutate(submissionData);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">En cours</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Complété</Badge>;
      case 'submitted':
        return <Badge className="bg-primary-500">Soumis</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Rapports réglementaires</h1>
            <p className="text-neutral-500">Générez et gérez vos rapports réglementaires</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <i className="fas fa-plus mr-2"></i>
                  Nouveau rapport
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Créer un nouveau rapport</DialogTitle>
                  <DialogDescription>
                    Sélectionnez le type de rapport réglementaire à générer.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom du rapport</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Bilan Carbone Annuel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de rapport</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez le type de rapport" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="BEGES">BEGES (Bilan d'Émission de Gaz à Effet de Serre)</SelectItem>
                              <SelectItem value="CSRD">CSRD (Corporate Sustainability Reporting Directive)</SelectItem>
                              <SelectItem value="BILAN_CARBONE">Bilan Carbone®</SelectItem>
                              <SelectItem value="ISO_14064">Rapport ISO 14064</SelectItem>
                              <SelectItem value="ADEME">Format ADEME</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Année</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        disabled={createReportMutation.isPending}
                      >
                        {createReportMutation.isPending ? "Création..." : "Créer le rapport"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-primary-500 mb-1">
              <i className="fas fa-file-alt text-xl"></i>
              <h3 className="font-medium">BEGES</h3>
            </div>
            <p className="text-sm text-neutral-600 mb-4">Bilan d'Émission de Gaz à Effet de Serre - Document réglementaire obligatoire pour les entreprises de plus de 500 salariés.</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-warning font-medium flex items-center">
                <i className="fas fa-clock mr-1"></i>
                Échéance: 31/12/2023
              </span>
              <Button variant="outline" size="sm">
                <i className="fas fa-info-circle mr-1"></i> Guide
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-secondary-500 mb-1">
              <i className="fas fa-file-alt text-xl"></i>
              <h3 className="font-medium">CSRD</h3>
            </div>
            <p className="text-sm text-neutral-600 mb-4">Corporate Sustainability Reporting Directive - Directive européenne sur le reporting de durabilité des entreprises.</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-success font-medium flex items-center">
                <i className="fas fa-check-circle mr-1"></i>
                Complété (15/05/2023)
              </span>
              <Button variant="outline" size="sm">
                <i className="fas fa-info-circle mr-1"></i> Guide
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-green-600 mb-1">
              <i className="fas fa-file-alt text-xl"></i>
              <h3 className="font-medium">Bilan Carbone®</h3>
            </div>
            <p className="text-sm text-neutral-600 mb-4">Méthode de comptabilisation des émissions de GES développée par l'ADEME - Format recommandé.</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-500 font-medium flex items-center">
                <i className="fas fa-exclamation-circle mr-1"></i>
                Facultatif
              </span>
              <Button variant="outline" size="sm">
                <i className="fas fa-info-circle mr-1"></i> Guide
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mes rapports</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded" />
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Année</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Créé le</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports && reports.length > 0 ? (
                    reports.map((report: any) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.year}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>{formatDate(report.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <i className="fas fa-eye mr-1"></i> Voir
                            </Button>
                            {report.status === 'draft' && (
                              <Button variant="outline" size="sm">
                                <i className="fas fa-edit mr-1"></i> Modifier
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <i className="fas fa-download mr-1"></i> Télécharger
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                        Aucun rapport trouvé. Cliquez sur "Nouveau rapport" pour en créer un.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Échéances réglementaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative flex items-start pb-5 pl-6 border-l-2 border-neutral-200 last:border-l-0 last:pb-0">
              <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-primary-500 bg-white"></div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium">BEGES - Bilan d'Émission de Gaz à Effet de Serre</h4>
                  <Badge className="bg-warning">À venir</Badge>
                </div>
                <p className="text-sm text-neutral-600 mb-2">Échéance : 31/12/2023 (dans 30 jours)</p>
                <div className="text-sm text-neutral-500">
                  <p>Le Bilan d'Émission de Gaz à Effet de Serre est obligatoire tous les 4 ans pour les entreprises de plus de 500 salariés.</p>
                </div>
              </div>
            </div>
            
            <div className="relative flex items-start pb-5 pl-6 border-l-2 border-neutral-200 last:border-l-0 last:pb-0">
              <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-success bg-white"></div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium">CSRD - Corporate Sustainability Reporting Directive</h4>
                  <Badge className="bg-success">Complété</Badge>
                </div>
                <p className="text-sm text-neutral-600 mb-2">Soumis le 15/05/2023</p>
                <div className="text-sm text-neutral-500">
                  <p>Rapport soumis par Sophie Martin - Télécharger le <a href="#" className="text-primary-500 hover:underline">récépissé de dépôt</a></p>
                </div>
              </div>
            </div>
            
            <div className="relative flex items-start pb-5 pl-6 border-l-2 border-neutral-200 last:border-l-0 last:pb-0">
              <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-neutral-300 bg-white"></div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium">Taxonomie verte européenne</h4>
                  <Badge variant="outline">Optionnel</Badge>
                </div>
                <p className="text-sm text-neutral-600 mb-2">Échéance : 30/06/2024 (dans 6 mois)</p>
                <div className="text-sm text-neutral-500">
                  <p>Reporting sur les activités économiques durables selon la Taxonomie européenne.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
