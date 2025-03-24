import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Form schema for company information
const companyFormSchema = z.object({
  name: z.string().min(1, "Le nom de l'entreprise est requis"),
  sector: z.string().min(1, "Le secteur d'activité est requis"),
  sectorCode: z.string().optional(),
  employeeCount: z.coerce.number().min(1, "Le nombre d'employés est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  postalCode: z.string().min(1, "Le code postal est requis"),
  city: z.string().min(1, "La ville est requise"),
  country: z.string().default("France"),
  siret: z.string().regex(/^\d{14}$/, "Le SIRET doit contenir 14 chiffres"),
});

// Form schema for DPO information
const dpoFormSchema = z.object({
  dpoName: z.string().min(1, "Le nom du DPO est requis"),
  dpoEmail: z.string().email("L'email du DPO doit être valide"),
  dpoPhone: z.string().min(1, "Le téléphone du DPO est requis"),
  dpoIsExternal: z.boolean().default(false),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;
type DpoFormValues = z.infer<typeof dpoFormSchema>;

export default function CompanyPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  const { data: company, isLoading } = useQuery({
    queryKey: ["/api/companies", user?.companyId || 1],
  });

  const companyForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: "",
      sector: "",
      sectorCode: "",
      employeeCount: 0,
      address: "",
      postalCode: "",
      city: "",
      country: "France",
      siret: "",
    },
  });

  const dpoForm = useForm<DpoFormValues>({
    resolver: zodResolver(dpoFormSchema),
    defaultValues: {
      dpoName: "",
      dpoEmail: "",
      dpoPhone: "",
      dpoIsExternal: false,
    },
  });

  // Set form values when company data is loaded
  React.useEffect(() => {
    if (company) {
      companyForm.reset({
        name: company.name,
        sector: company.sector || "",
        sectorCode: company.sectorCode || "",
        employeeCount: company.employeeCount || 0,
        address: company.address || "",
        postalCode: company.postalCode || "",
        city: company.city || "",
        country: company.country || "France",
        siret: company.siret || "",
      });
      
      dpoForm.reset({
        dpoName: company.dpoName || "",
        dpoEmail: company.dpoEmail || "",
        dpoPhone: company.dpoPhone || "",
        dpoIsExternal: company.dpoIsExternal || false,
      });
    }
  }, [company, companyForm, dpoForm]);

  const updateCompanyMutation = useMutation({
    mutationFn: async (data: CompanyFormValues) => {
      return apiRequest("PUT", `/api/companies/${user?.companyId || 1}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies", user?.companyId || 1] });
      toast({
        title: "Entreprise mise à jour",
        description: "Les informations de l'entreprise ont été mises à jour avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations de l'entreprise.",
        variant: "destructive",
      });
    },
  });

  const updateDpoMutation = useMutation({
    mutationFn: async (data: DpoFormValues) => {
      return apiRequest("PUT", `/api/companies/${user?.companyId || 1}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies", user?.companyId || 1] });
      toast({
        title: "DPO mis à jour",
        description: "Les informations du DPO ont été mises à jour avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations du DPO.",
        variant: "destructive",
      });
    },
  });

  const onSubmitCompany = (data: CompanyFormValues) => {
    updateCompanyMutation.mutate(data);
  };

  const onSubmitDpo = (data: DpoFormValues) => {
    updateDpoMutation.mutate(data);
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Profil entreprise</h1>
            <p className="text-neutral-500">Gérez les informations de votre entreprise</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 sm:w-auto">
              <TabsTrigger value="general">Informations générales</TabsTrigger>
              <TabsTrigger value="rgpd">RGPD & DPO</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full max-w-md" />
              <Skeleton className="h-10 w-full max-w-md" />
              <Skeleton className="h-10 w-full max-w-md" />
              <Skeleton className="h-10 w-full max-w-md" />
              <Skeleton className="h-10 w-full max-w-md" />
              <Skeleton className="h-10 w-full max-w-md" />
            </div>
          ) : (
            <>
              <TabsContent value="general" className="mt-4">
                <Form {...companyForm}>
                  <form onSubmit={companyForm.handleSubmit(onSubmitCompany)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={companyForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom de l'entreprise</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={companyForm.control}
                        name="siret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SIRET</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              14 chiffres sans espaces
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={companyForm.control}
                        name="sector"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secteur d'activité</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={companyForm.control}
                        name="sectorCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Code NAF/APE</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={companyForm.control}
                      name="employeeCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre d'employés</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Separator />
                    
                    <h3 className="text-lg font-medium">Adresse</h3>
                    
                    <FormField
                      control={companyForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={companyForm.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Code postal</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={companyForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ville</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={companyForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pays</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={updateCompanyMutation.isPending}
                      className="mt-6"
                    >
                      {updateCompanyMutation.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="rgpd" className="mt-4">
                <Alert className="mb-6">
                  <i className="fas fa-shield-alt mr-2"></i>
                  <AlertTitle>Désignation d'un DPO</AlertTitle>
                  <AlertDescription className="mt-2">
                    Selon l'article 37 du RGPD, un Délégué à la Protection des Données (DPO) doit être désigné lorsque le traitement est effectué par une autorité publique, lorsque les activités principales consistent en un traitement à grande échelle de données sensibles, ou lorsque le traitement exige un suivi régulier et systématique à grande échelle des personnes concernées.
                  </AlertDescription>
                </Alert>
                
                <Form {...dpoForm}>
                  <form onSubmit={dpoForm.handleSubmit(onSubmitDpo)} className="space-y-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <input 
                        type="checkbox" 
                        id="dpoIsExternal" 
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                        checked={dpoForm.watch("dpoIsExternal")}
                        onChange={(e) => dpoForm.setValue("dpoIsExternal", e.target.checked)}
                      />
                      <label htmlFor="dpoIsExternal" className="text-sm font-medium text-neutral-700">
                        DPO externe (prestataire)
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={dpoForm.control}
                        name="dpoName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom du DPO</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={dpoForm.control}
                        name="dpoEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email du DPO</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={dpoForm.control}
                      name="dpoPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone du DPO</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      disabled={updateDpoMutation.isPending}
                      className="mt-6"
                    >
                      {updateDpoMutation.isPending ? "Enregistrement..." : "Enregistrer les informations du DPO"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="users" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Utilisateurs de la plateforme</CardTitle>
                    <CardDescription>
                      Gérez les utilisateurs ayant accès à CarbonOS pour votre entreprise
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end mb-4">
                      <Button>
                        <i className="fas fa-user-plus mr-2"></i>
                        Inviter un utilisateur
                      </Button>
                    </div>
                    
                    <div className="border rounded-md">
                      <div className="p-4 border-b flex justify-between items-center">
                        <div>
                          <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                          <div className="text-sm text-neutral-500">{user?.email}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                            {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                          </span>
                          <Button variant="ghost" size="sm" disabled>
                            <i className="fas fa-ellipsis-v"></i>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4 border-b flex justify-between items-center">
                        <div>
                          <div className="font-medium">Pierre Dupont</div>
                          <div className="text-sm text-neutral-500">pierre.dupont@exemple.fr</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-800 rounded-full">
                            Éditeur
                          </span>
                          <Button variant="ghost" size="sm">
                            <i className="fas fa-ellipsis-v"></i>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <div className="font-medium">Marie Lambert</div>
                          <div className="text-sm text-neutral-500">marie.lambert@exemple.fr</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                            DPO
                          </span>
                          <Button variant="ghost" size="sm">
                            <i className="fas fa-ellipsis-v"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
