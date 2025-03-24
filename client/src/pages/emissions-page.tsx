import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

// Form schema for emissions data
const emissionFormSchema = z.object({
  companyId: z.number().optional(),
  reportingPeriod: z.string().min(1, "La période est requise"),
  reportingYear: z.coerce.number().min(2000, "L'année doit être supérieure à 2000"),
  scope1Total: z.coerce.number().min(0, "La valeur doit être positive"),
  scope2Total: z.coerce.number().min(0, "La valeur doit être positive"),
  scope3Total: z.coerce.number().min(0, "La valeur doit être positive"),
  methodologyNotes: z.string().optional(),
});

type EmissionFormValues = z.infer<typeof emissionFormSchema>;

export default function EmissionsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: emissions, isLoading } = useQuery({
    queryKey: ["/api/emissions"],
  });

  const form = useForm<EmissionFormValues>({
    resolver: zodResolver(emissionFormSchema),
    defaultValues: {
      companyId: user?.companyId || 1,
      reportingPeriod: "",
      reportingYear: new Date().getFullYear(),
      scope1Total: 0,
      scope2Total: 0,
      scope3Total: 0,
      methodologyNotes: "",
    },
  });

  const createEmissionMutation = useMutation({
    mutationFn: async (data: EmissionFormValues) => {
      return apiRequest("POST", "/api/emissions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emissions"] });
      toast({
        title: "Données d'émission créées",
        description: "Les données d'émission ont été enregistrées avec succès.",
      });
      form.reset();
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les données d'émission.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EmissionFormValues) => {
    // Calculate total emissions
    const totalEmissions = data.scope1Total + data.scope2Total + data.scope3Total;
    
    // Add companyId from the user if available
    const submissionData = {
      ...data,
      companyId: user?.companyId || 1,
      totalEmissions,
    };
    
    createEmissionMutation.mutate(submissionData);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const filterEmissions = (status: string) => {
    if (!emissions) return [];
    if (status === "all") return emissions;
    return emissions.filter((emission: any) => emission.status === status);
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Calcul d'émissions</h1>
            <p className="text-neutral-500">Gérez vos données d'émissions carbone</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <i className="fas fa-plus mr-2"></i>
                  Nouvelles données
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Ajouter des données d'émission</DialogTitle>
                  <DialogDescription>
                    Entrez les données d'émissions carbone pour la période sélectionnée.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="reportingPeriod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Période</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez une période" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Janvier">Janvier</SelectItem>
                                <SelectItem value="Février">Février</SelectItem>
                                <SelectItem value="Mars">Mars</SelectItem>
                                <SelectItem value="Avril">Avril</SelectItem>
                                <SelectItem value="Mai">Mai</SelectItem>
                                <SelectItem value="Juin">Juin</SelectItem>
                                <SelectItem value="Juillet">Juillet</SelectItem>
                                <SelectItem value="Août">Août</SelectItem>
                                <SelectItem value="Septembre">Septembre</SelectItem>
                                <SelectItem value="Octobre">Octobre</SelectItem>
                                <SelectItem value="Novembre">Novembre</SelectItem>
                                <SelectItem value="Décembre">Décembre</SelectItem>
                                <SelectItem value="T1">Trimestre 1</SelectItem>
                                <SelectItem value="T2">Trimestre 2</SelectItem>
                                <SelectItem value="T3">Trimestre 3</SelectItem>
                                <SelectItem value="T4">Trimestre 4</SelectItem>
                                <SelectItem value="Année complète">Année complète</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="reportingYear"
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
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="scope1Total"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Scope 1 (tCO₂e)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>Émissions directes</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="scope2Total"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Scope 2 (tCO₂e)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>Émissions indirectes (énergie)</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="scope3Total"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Scope 3 (tCO₂e)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>Autres émissions indirectes</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="methodologyNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes méthodologiques</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Décrivez la méthodologie utilisée pour le calcul"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        disabled={createEmissionMutation.isPending}
                      >
                        {createEmissionMutation.isPending ? "Enregistrement..." : "Enregistrer"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <CardTitle>Données d'émissions</CardTitle>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto mt-4 md:mt-0">
              <TabsList>
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="draft">Brouillons</TabsTrigger>
                <TabsTrigger value="submitted">Soumises</TabsTrigger>
                <TabsTrigger value="validated">Validées</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded" />
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Période</TableHead>
                    <TableHead>Année</TableHead>
                    <TableHead>Scope 1</TableHead>
                    <TableHead>Scope 2</TableHead>
                    <TableHead>Scope 3</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date de soumission</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterEmissions(activeTab).length > 0 ? (
                    filterEmissions(activeTab).map((emission: any) => (
                      <TableRow key={emission.id}>
                        <TableCell>{emission.reportingPeriod}</TableCell>
                        <TableCell>{emission.reportingYear}</TableCell>
                        <TableCell>{emission.scope1Total} tCO₂e</TableCell>
                        <TableCell>{emission.scope2Total} tCO₂e</TableCell>
                        <TableCell>{emission.scope3Total} tCO₂e</TableCell>
                        <TableCell>{emission.totalEmissions} tCO₂e</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            emission.status === 'validated' ? 'bg-success bg-opacity-10 text-success' :
                            emission.status === 'submitted' ? 'bg-primary-500 bg-opacity-10 text-primary-600' :
                            'bg-neutral-200 text-neutral-600'
                          }`}>
                            {emission.status === 'draft' ? 'Brouillon' : 
                             emission.status === 'submitted' ? 'Soumis' : 
                             emission.status === 'validated' ? 'Validé' : 
                             emission.status === 'rejected' ? 'Rejeté' : emission.status}
                          </span>
                        </TableCell>
                        <TableCell>{emission.submittedAt ? formatDate(emission.submittedAt) : '-'}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <i className="fas fa-eye mr-1"></i> Voir
                            </Button>
                            {emission.status === 'draft' && (
                              <Button variant="outline" size="sm">
                                <i className="fas fa-edit mr-1"></i> Modifier
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-neutral-500">
                        Aucune donnée d'émission trouvée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
