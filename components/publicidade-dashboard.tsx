"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import * as api from "@/src/services/api";
import type { Partnership } from "@/src/services/api";
import {
  Users,
  CalendarIcon,
  Target,
  Plus,
  Filter,
  Instagram,
  Youtube,
  TicketIcon as TikTok,
  Lightbulb,
  HelpCircle,
  Phone,
  Search,
  FileText,
  Clock,
  Receipt,
  BookOpen,
  ArrowLeft,
  Expand,
  AlertCircle,
  CheckCircle,
  UserPlus,
  FileBarChart,
  MessageCircle,
  ExternalLink,
  Archive,
  RotateCcw,
  LucideContrast as FileContract,
  CalendarIcon as CalendarIcon2,
  MapPin,
  Mail,
  Edit,
  Moon,
  Sun,
  X,
  Twitch,
  Gift,
} from "lucide-react";


const getSocialIcon = (social: string) => {
  switch (social.toLowerCase()) {
    case "instagram":
      return <Instagram className="w-4 h-4" />;
    case "youtube":
      return <Youtube className="w-4 h-4" />;
    case "tiktok":
      return <TikTok className="w-4 h-4" />;
    case "x":
    case "twitter":
      return <X className="w-4 h-4" />;
    case "twitch":
      return <Twitch className="w-4 h-4" />;
    default:
      return null;
  }
};

const getEventColor = (tipo: string) => {
  switch (tipo) {
    case "roteiro":
      return "bg-blue-500";
    case "conteudo":
      return "bg-yellow-500";
    case "publicacao":
      return "bg-green-500";
    case "nfe":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case "roteiro":
      return <FileText className="w-4 h-4" />;
    case "conteudo":
      return <Edit className="w-4 h-4" />;
    case "publicacao":
      return <Instagram className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

export function PublicidadeDashboard() {
  // --- ESTADOS PARA OS DADOS VINDOS DA API ---
  const [metricas, setMetricas] = useState<any>({});
  const [parcerias, setParcerias] = useState<any[]>([]);
  const [parceriasAnteriores, setParceriasAnteriores] = useState<any[]>([]);
  const [marcasDisponiveis, setMarcasDisponiveis] = useState<any[]>([]);
  const [agendaSemana, setAgendaSemana] = useState<any[]>([]);
  const [influenciadoresBase, setInfluenciadoresBase] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- TODOS OS SEUS ESTADOS DE CONTROLE DA UI FORAM MANTIDOS ---
  const [filtroStatus, setFiltroStatus] = useState("todas");
  const [showNovaCampanha, setShowNovaCampanha] = useState(false);
  const [showDetalhes, setShowDetalhes] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [showExpandedCalendar, setShowExpandedCalendar] = useState(false);
  const [showNFInfo, setShowNFInfo] = useState(false);
  const [showNFTutorial, setShowNFTutorial] = useState(false);
  const [filtroInfluenciador, setFiltroInfluenciador] = useState("todos");
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [showCronograma, setShowCronograma] = useState(false);
  const [showInfluenciadorInfo, setShowInfluenciadorInfo] = useState<any>(null);
  const [showMarcaInfo, setShowMarcaInfo] = useState<any>(null);
  const [showAdicionarInfluenciador, setShowAdicionarInfluenciador] =
    useState(false);
  const [showHistorico, setShowHistorico] = useState(false);
  const [showParceriaAnterior, setShowParceriaAnterior] = useState<any>(null);
  const [showFiltros, setShowFiltros] = useState(false);
  const [filtroMarca, setFiltroMarca] = useState("todas");
  const [filtroResponsavel, setFiltroResponsavel] = useState("todos");
  const [showEncerrarCampanha, setShowEncerrarCampanha] = useState<
    number | null
  >(null);
  const [showConfirmarFinalizacao, setShowConfirmarFinalizacao] = useState<
    number | null
  >(null);
  const [showProximoMes, setShowProximoMes] = useState<number | null>(null);
  const [showAdicionarObservacao, setShowAdicionarObservacao] = useState<
    number | null
  >(null);
  const [editingCampanha, setEditingCampanha] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [editHistory, setEditHistory] = useState<{
    [key: number]: Array<{ data: string; usuario: string; alteracao: string }>;
  }>({});

  const [showBuscarParcerias, setShowBuscarParcerias] = useState(false);
  const [novaCampanhaData, setNovaCampanhaData] = useState({
    marca: "",
    influenciador: "",
    responsavel: "",
    periodo: "mensal",
    tipo: "monetaria",
    redes: [] as string[],
    tipoInsercao: "",
    valor: "",
    acabaEm: "",
    porcentagem: "25",
  });
  const [influenciadoresSugeridos, setInfluenciadoresSugeridos] = useState<
    any[]
  >([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const partnershipsData = await api.getPartnerships();
        setParcerias(partnershipsData);

        // Calcula as métricas com base nos dados recebidos
        const totalInfluenciadores = new Set(partnershipsData.flatMap(p => p.influenciadores.map(i => i.nome))).size;
        setMetricas(prev => ({
          ...prev,
          parceriasAtivas: partnershipsData.filter(p => p.status === 'ativa').length,
          totalInfluenciadores: totalInfluenciadores,
        }));

      } catch (error) {
        console.error("Falha na comunicação com o backend:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (novaCampanhaData.influenciador.length > 2) {
      const sugestoes = influenciadoresBase.filter((inf) =>
        inf.nome
          .toLowerCase()
          .includes(novaCampanhaData.influenciador.toLowerCase())
      );
      setInfluenciadoresSugeridos(sugestoes);
    } else {
      setInfluenciadoresSugeridos([]);
    }
  }, [novaCampanhaData.influenciador, influenciadoresBase]);

  const parceriasFiltradas = parcerias.filter((parceria) => {
    if (filtroStatus === "anteriores") return false;
    if (filtroStatus !== "todas" && parceria.status !== filtroStatus)
      return false;
    if (filtroMarca !== "todas" && parceria.marca !== filtroMarca) return false;
    if (
      filtroResponsavel !== "todos" &&
      parceria.responsavel !== filtroResponsavel
    )
      return false;
    return true;
  });

  const toggleCheck = (itemId: string) => {
    setCheckedItems((prev) => {
      const newState = {
        ...prev,
        [itemId]: !prev[itemId],
      };

      const parceriaId = Number.parseInt(itemId.split("-")[1]);
      if (parceriaId) {
        setTimeout(() => verificarChecklistsCompletos(parceriaId), 100);
      }

      return newState;
    });
  };

  // TODO: Conectar estas funções com a API (POST/PUT/DELETE) para persistir as mudanças no banco de dados.
  const finalizarCampanha = (parceriaId: number) => {
    const parceria = parcerias.find((p) => p.id === parceriaId);
    if (parceria) {
      setParceriasAnteriores((prev) => [
        ...prev,
        {
          ...parceria,
          id: parceria.id + 100, // Evita conflito
          finalizadaEm: new Date().toISOString().split("T")[0],
          renovadaEm: null,
        },
      ]);
      setParcerias((prev) => prev.filter((p) => p.id !== parceriaId));
      setShowDetalhes(null);
      setShowEncerrarCampanha(null);
      setShowConfirmarFinalizacao(null);
      setTimeout(() => setShowAdicionarObservacao(parceriaId), 500);
    }
  };

  const renovarParceria = (parceriaId: number) => {
    const parceriaAnterior = parceriasAnteriores.find(
      (p) => p.id === parceriaId
    );
    if (parceriaAnterior) {
      setParceriasAnteriores((prev) =>
        prev.map((p) =>
          p.id === parceriaId
            ? { ...p, renovadaEm: new Date().toISOString().split("T")[0] }
            : p
        )
      );
      const novaParceria = {
        ...parceriaAnterior,
        id: Date.now(),
        marca: `${parceriaAnterior.marca} (Renovada)`,
        status: "ativa" as const,
        iniciadaEm: new Date().toISOString().split("T")[0],
        progresso: 0,
        mesAtual: 1,
      };
      setParcerias((prev) => [...prev, novaParceria]);
    }
  };

  const criarNovaCampanha = () => {
    const novaParceria = {
      id: Date.now(),
      marca: novaCampanhaData.marca,
      status: "planejada" as const,
      tipo: novaCampanhaData.tipo as "monetaria" | "permuta",
      periodo: novaCampanhaData.periodo as
        | "mensal"
        | "trimestral"
        | "semestral"
        | "anual",
      mesAtual: 1,
      totalMeses: 1,
      postagensRealizadas: { mes1: 0 },
      postagensTotal: { mes1: 4 },
      influenciadores: [
        {
          nome: novaCampanhaData.influenciador,
          foto:
            "/placeholder.svg?height=40&width=40&query=" +
            novaCampanhaData.influenciador.toLowerCase().replace(" ", "+"),
          redes: novaCampanhaData.redes,
          seguidores: { instagram: 100000 },
          nicho: "General",
          responsavel: novaCampanhaData.responsavel,
          contato: "+55 11 99999-0000",
          whatsapp: "5511999990000",
          valor: Number(novaCampanhaData.valor) || 0,
          email: "contato@exemplo.com",
          endereco: "São Paulo, SP",
          mediaKit: "",
        },
      ],
      responsavel: novaCampanhaData.responsavel,
      tipoInsercao: novaCampanhaData.tipoInsercao,
      progresso: 0,
      valorInfluenciadores: Number(novaCampanhaData.valor) || 0,
      valorAgencia: (Number(novaCampanhaData.valor) || 0) * 0.3,
      porcentagemAgencia: 30,
      iniciadaEm: new Date().toISOString().split("T")[0],
      terminaEm:
        novaCampanhaData.acabaEm ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      cronograma: [],
      calendario: [],
      sugestoes: [],
    };
    // @ts-ignore
    setParcerias((prev) => [...prev, novaParceria]);
    setShowNovaCampanha(false);
    setNovaCampanhaData({
      marca: "",
      influenciador: "",
      responsavel: "",
      periodo: "mensal",
      tipo: "monetaria",
      redes: [],
      tipoInsercao: "",
      valor: "",
      acabaEm: "",
      porcentagem: "25",
    });
  };

  const adicionarEdicao = (campanhaId: number, alteracao: string) => {
    const novaEdicao = {
      data: new Date().toLocaleDateString(),
      usuario: "Usuário Atual",
      alteracao,
    };
    setEditHistory((prev) => ({
      ...prev,
      [campanhaId]: [...(prev[campanhaId] || []), novaEdicao],
    }));
  };

  const gerarRelatorioPDF = () => {
    alert(`Gerando relatório PDF com ${parcerias.length} parcerias ativas...`);
  };

  const verificarChecklistsCompletos = (parceriaId: number) => {
    const parceria = parcerias.find((p) => p.id === parceriaId);
    if (!parceria) return;

    const checklistKeys = [
      `post1-${parceriaId}`,
      `stories1-${parceriaId}`,
      `post2-${parceriaId}`,
      `reels1-${parceriaId}`,
      `post3-${parceriaId}`,
      `stories2-${parceriaId}`,
    ];
    const todosCompletos = checklistKeys.every((key) => checkedItems[key]);

    if (todosCompletos && showEncerrarCampanha !== parceriaId) {
      setShowEncerrarCampanha(parceriaId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="text-2xl font-bold">Carregando Dashboard...</div>
      </div>
    );
  }

  if (showDetalhes) {
    const parceria = parcerias.find((p) => p.id === showDetalhes);
    if (!parceria) return null;

    return (
      <div
        className={`container mx-auto p-6 space-y-6 ${darkMode ? "dark" : ""}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setShowDetalhes(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{parceria.marca}</h1>
              <p className="text-muted-foreground">
                Parceria iniciada em:{" "}
                {new Date(parceria.iniciadaEm).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setEditingCampanha(parceria.id)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              onClick={() => finalizarCampanha(parceria.id)}
            >
              <Archive className="w-4 h-4 mr-2" />
              Finalizar Campanha
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Briefing e Cronograma */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Briefing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Conferir Briefing Completo</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon2 className="w-5 h-5" />
                    Cronograma
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setShowCronograma(true)}
                  >
                    Ver Cronograma Detalhado
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileContract className="w-5 h-5" />
                    Contrato
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Conferir Contrato
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Influenciadores da Campanha</CardTitle>
                <CardDescription>
                  Status e performance de cada influenciador
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Influenciador</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Posts</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parceria.influenciadores.map(
                      (influenciador: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage
                                  src={influenciador.foto || "/placeholder.svg"}
                                />
                                <AvatarFallback>
                                  {influenciador.nome
                                    .split(" ")
                                    .map((n: any) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <button
                                  className="font-medium text-left hover:text-primary"
                                  onClick={() =>
                                    setShowInfluenciadorInfo(influenciador)
                                  }
                                >
                                  {influenciador.nome}
                                </button>
                                <p className="text-sm text-muted-foreground">
                                  {influenciador.seguidores?.instagram || 0}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{influenciador.responsavel}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>
                                {0}/{0}
                              </span>
                              {0 === 0 ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Clock className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            R$ {influenciador.valor?.toLocaleString() || "0"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={"default"}>{"Ativo"}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                window.open(
                                  `https://wa.me/${"5511999990001"}`,
                                  "_blank"
                                )
                              }
                            >
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAdicionarInfluenciador(true)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Adicionar Influenciador
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={gerarRelatorioPDF}
                  >
                    <FileBarChart className="w-4 h-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Checklist de Postagens</CardTitle>
                <CardDescription>
                  Acompanhe o progresso das entregas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    id: `post1-${parceria.id}`,
                    titulo: "Post 1 - Feed Instagram",
                    status: "concluido",
                    data: "15/12",
                  },
                  {
                    id: `stories1-${parceria.id}`,
                    titulo: "Stories Instagram",
                    status: "concluido",
                    data: "15/12",
                  },
                  {
                    id: `post2-${parceria.id}`,
                    titulo: "Post 2 - Feed Instagram",
                    status: "concluido",
                    data: "18/12",
                  },
                  {
                    id: `reels1-${parceria.id}`,
                    titulo: "Reels Instagram",
                    status: "pendente",
                    data: "20/12",
                  },
                  {
                    id: `post3-${parceria.id}`,
                    titulo: "Post 3 - Feed Instagram",
                    status: "pendente",
                    data: "22/12",
                  },
                  {
                    id: `stories2-${parceria.id}`,
                    titulo: "Stories Finais",
                    status: "pendente",
                    data: "22/12",
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={
                          checkedItems[item.id] || item.status === "concluido"
                        }
                        onCheckedChange={() => toggleCheck(item.id)}
                        className="data-[state=checked]:bg-green-500"
                      />
                      <div>
                        <p className="font-medium">{item.titulo}</p>
                        <p className="text-sm text-muted-foreground">
                          Data: {item.data}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        checkedItems[item.id] || item.status === "concluido"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {checkedItems[item.id] || item.status === "concluido"
                        ? "Concluído"
                        : "Pendente"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Valores da Parceria</CardTitle>
                <CardDescription>
                  Distribuição de valores e comissões
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      R${" "}
                      {parceria.valorInfluenciadores?.toLocaleString() || "0"}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Valor Influenciadores
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {parceria.porcentagem || 25}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Nossa Comissão
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      R$ {parceria.valorAgencia?.toLocaleString() || "0"}
                    </div>
                    <p className="text-sm text-muted-foreground">Nosso Valor</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Aprovações */}
            <Card>
              <CardHeader>
                <CardTitle>Controle de Aprovações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">
                      Roteiro para Aprovação
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Enviar até: 19/12/2024
                    </p>
                    <Button size="sm" variant="outline">
                      Enviar Roteiro
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">
                      Conteúdo para Aprovação
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Enviar até: 21/12/2024
                    </p>
                    <Button size="sm" variant="outline">
                      Enviar Conteúdo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Lateral */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Calendário de Postagens
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowExpandedCalendar(true)}
                  >
                    <Expand className="w-4 h-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  <div className="flex gap-2 mt-2">
                    <Select
                      value={filtroInfluenciador}
                      onValueChange={setFiltroInfluenciador}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filtrar por influenciador" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">
                          Todos os influenciadores
                        </SelectItem>
                        {parceria.influenciadores.map(
                          (inf: any, index: number) => (
                            <SelectItem key={index} value={inf.nome}>
                              {inf.nome}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Legenda:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Roteiro</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span>Conteúdo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Publicação</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded"></div>
                      <span>NF-e</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Notas Fiscais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <p className="font-medium">NF da Marca</p>
                  <p className="text-sm text-muted-foreground">
                    Emitir até: 25/12/2024
                  </p>
                  <Button
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => setShowNFInfo(true)}
                  >
                    Ver Informações
                  </Button>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="font-medium">Nossa NF</p>
                  <p className="text-sm text-muted-foreground">
                    Status: Pendente
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full bg-transparent"
                  >
                    Emitir NF
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => setShowNFTutorial(true)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Tutorial NF-e
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Cronograma Modal */}
        <Dialog open={showCronograma} onOpenChange={setShowCronograma}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cronograma Detalhado - {parceria.marca}</DialogTitle>
              <DialogDescription>
                Visualização completa do cronograma de postagens
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Tabela de Cronograma */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Rede Social</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Início</TableHead>
                      <TableHead>Dia da Semana</TableHead>
                      <TableHead>Frequência Por Semana</TableHead>
                      <TableHead>Observações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parceria.cronograma?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {item.redeSocial}
                        </TableCell>
                        <TableCell>{item.responsavel}</TableCell>
                        <TableCell>{item.inicio}</TableCell>
                        <TableCell>{item.diaSemana}</TableCell>
                        <TableCell>{item.frequencia}</TableCell>
                        <TableCell>{item.observacoes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Calendário Visual */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">Calendário Visual</h4>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Próximos Eventos</h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {parceria.calendario?.map((evento, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${getEventColor(
                            evento.tipo
                          )}`}
                        ></div>
                        <div className="flex-1">
                          <p className="font-medium">{evento.descricao}</p>
                          <p className="text-sm text-muted-foreground">
                            {evento.data}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {evento.influenciador}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Influencer Info Modal */}
        <Dialog
          open={!!showInfluenciadorInfo}
          onOpenChange={() => setShowInfluenciadorInfo(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Informações do Influenciador</DialogTitle>
            </DialogHeader>
            {showInfluenciadorInfo && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src={showInfluenciadorInfo.foto || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {showInfluenciadorInfo.nome
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">
                      {showInfluenciadorInfo.nome}
                    </h3>
                    <p className="text-muted-foreground">
                      Total: {0} seguidores
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Responsável: {showInfluenciadorInfo.responsavel}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Redes Sociais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {["Instagram"]?.map((rede: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {getSocialIcon("instagram")}
                            <span className="capitalize">instagram</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {0 || "N/A"}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Contato</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{"Não informado"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{"Não informado"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{"Não informado"}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open("", "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Conferir Mídia Kit
                  </Button>
                  <Button
                    onClick={() =>
                      window.open(`https://wa.me/${"5511999990001"}`, "_blank")
                    }
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Abrir WhatsApp
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Influencer Modal */}
        <Dialog
          open={showAdicionarInfluenciador}
          onOpenChange={setShowAdicionarInfluenciador}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Influenciador</DialogTitle>
              <DialogDescription>
                Preencha as informações do novo influenciador
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input id="nome" placeholder="Ex: Julia Puzzuoli" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsavel-inf">Responsável</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="felipe">Felipe Domingues</SelectItem>
                      <SelectItem value="vinicius">
                        Vinícius Florentino
                      </SelectItem>
                      <SelectItem value="alex">Alex Matida</SelectItem>
                      <SelectItem value="guilherme">
                        Guilherme Vieira
                      </SelectItem>
                      <SelectItem value="joao">João Gabriel</SelectItem>
                      <SelectItem value="jose">José Renato</SelectItem>
                      <SelectItem value="vitor">Vitor Spiazzi</SelectItem>
                      <SelectItem value="enzo">Enzo Vieira</SelectItem>
                      <SelectItem value="manoel">Manoel Henrique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" placeholder="+55 11 99999-9999" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-inf">Email</Label>
                  <Input
                    id="email-inf"
                    type="email"
                    placeholder="contato@influenciador.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Redes Sociais e Seguidores</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="instagram-inf" />
                    <Label htmlFor="instagram-inf">Instagram</Label>
                    <Input placeholder="Ex: 1.2M" className="w-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="tiktok-inf" />
                    <Label htmlFor="tiktok-inf">TikTok</Label>
                    <Input placeholder="Ex: 500K" className="w-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="youtube-inf" />
                    <Label htmlFor="youtube-inf">YouTube</Label>
                    <Input placeholder="Ex: 800K" className="w-24" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor-inf">Valor por Post (R$)</Label>
                  <Input id="valor-inf" type="number" placeholder="5000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="posts-total">Total de Posts</Label>
                  <Input id="posts-total" type="number" placeholder="6" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mediakit">Link do Mídia Kit</Label>
                <Input
                  id="mediakit"
                  placeholder="https://drive.google.com/..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAdicionarInfluenciador(false)}
              >
                Cancelar
              </Button>
              <Button onClick={() => setShowAdicionarInfluenciador(false)}>
                Adicionar Influenciador
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ... existing modals for expanded calendar, NF info, NF tutorial ... */}
        <Dialog
          open={showExpandedCalendar}
          onOpenChange={setShowExpandedCalendar}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Calendário Completo</DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Próximos Eventos</h4>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showNFInfo} onOpenChange={setShowNFInfo}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Informações para NF da Marca</DialogTitle>
              <DialogDescription>
                Dados necessários para emissão da nota fiscal
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Razão Social</Label>
                  <Input value="Basicamente Moda Ltda" readOnly />
                </div>
                <div>
                  <Label>CNPJ</Label>
                  <Input value="12.345.678/0001-90" readOnly />
                </div>
                <div>
                  <Label>Inscrição Estadual</Label>
                  <Input value="123.456.789.123" readOnly />
                </div>
                <div>
                  <Label>Códigos CNAE</Label>
                  <Input value="4781-4/00, 7311-4/00" readOnly />
                </div>
              </div>
              <div>
                <Label>Endereço Completo</Label>
                <Textarea
                  value="Rua das Flores, 123 - Centro - São Paulo/SP - CEP: 01234-567"
                  readOnly
                />
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Observações</h4>
                  <Button size="sm" variant="outline">
                    Adicionar Observação
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">Prazo de emissão: até 25/12/2024</p>
                    <p className="text-xs text-muted-foreground">
                      Adicionado por Felipe Domingues em 15/12/2024
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Como Enviar a NF-e</h4>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm mb-2">
                    <strong>Email:</strong> financeiro@basicamente.com.br
                  </p>
                  <p className="text-sm mb-2">
                    <strong>Assunto:</strong> NF-e Campanha [Nome da Campanha]
                  </p>
                  <p className="text-sm">
                    <strong>Anexar:</strong> XML e PDF da nota fiscal
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showNFTutorial} onOpenChange={setShowNFTutorial}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Tutorial NF-e por Marca</DialogTitle>
              <DialogDescription>
                Padrões e preferências de cada marca
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Basicamente</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Descrição do Serviço:</strong> Serviços de
                    publicidade e marketing digital
                  </p>
                  <p>
                    <strong>Código de Serviço:</strong> 17.06
                  </p>
                  <p>
                    <strong>Prazo de Envio:</strong> Até 5 dias após a conclusão
                  </p>
                  <p>
                    <strong>Observações:</strong> Sempre incluir número da
                    campanha no campo observações
                  </p>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Manual</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Descrição do Serviço:</strong> Serviços de
                    publicidade e marketing digital
                  </p>
                  <p>
                    <strong>Código de Serviço:</strong> 17.23
                  </p>
                  <p>
                    <strong>Prazo de Envio:</strong> Até 3 dias após a conclusão
                  </p>
                  <p>
                    <strong>Observações:</strong> Exigem detalhamento das
                    entregas no campo descrição
                  </p>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  Dicas Importantes
                </h4>
                <ul className="text-sm space-y-1 text-yellow-800">
                  <li>
                    • Sempre conferir se o CNPJ está correto antes de emitir
                  </li>
                  <li>• Manter backup dos XMLs por pelo menos 5 anos</li>
                  <li>• Enviar por email com confirmação de leitura</li>
                  <li>• Em caso de erro, cancelar e reemitir dentro de 24h</li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog
          open={showEncerrarCampanha !== null}
          onOpenChange={() => setShowEncerrarCampanha(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Finalizar Campanha?</DialogTitle>
              <DialogDescription>
                Todos os checklists foram concluídos. Deseja finalizar esta
                campanha?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowEncerrarCampanha(null)}
              >
                Não
              </Button>
              <Button
                onClick={() => {
                  /* Logic to proceed */
                }}
              >
                Sim
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={showProximoMes !== null}
          onOpenChange={() => setShowProximoMes(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ir para o próximo mês?</DialogTitle>
              <DialogDescription>
                Deseja continuar para o próximo mês ou finalizar a campanha?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  /* Logic to finalize */
                }}
              >
                Finalizar
              </Button>
              <Button
                onClick={() => {
                  /* Logic to advance */
                }}
              >
                Próximo Mês
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={showConfirmarFinalizacao !== null}
          onOpenChange={() => setShowConfirmarFinalizacao(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Finalização?</DialogTitle>
              <DialogDescription>
                Tem certeza? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmarFinalizacao(null)}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  /* Logic to confirm */
                }}
              >
                Confirmar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={editingCampanha !== null}
          onOpenChange={() => setEditingCampanha(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Campanha</DialogTitle>
            </DialogHeader>
            {/* Edit Form */}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white`}
    >
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1
              className={`text-3xl font-bold transition-colors duration-300 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Controle de Publicidades
            </h1>
            <p
              className={`transition-colors duration-300 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Gerencie suas campanhas e influenciadores
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sun
                className={`w-4 h-4 transition-colors duration-300 ${
                  darkMode ? "text-gray-400" : "text-yellow-500"
                }`}
              />
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              <Moon
                className={`w-4 h-4 transition-colors duration-300 ${
                  darkMode ? "text-blue-400" : "text-gray-400"
                }`}
              />
            </div>
            <Dialog open={showNovaCampanha} onOpenChange={setShowNovaCampanha}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Campanha
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nova Campanha</DialogTitle>
                  <DialogDescription>
                    Preencha as informações da nova campanha
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="marca">Nome da Marca</Label>
                      <Input
                        id="marca"
                        placeholder="Ex: Basicamente"
                        value={novaCampanhaData.marca}
                        onChange={(e) =>
                          setNovaCampanhaData((prev) => ({
                            ...prev,
                            marca: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responsavel">Responsável</Label>
                      <Select
                        value={novaCampanhaData.responsavel}
                        onValueChange={(value) =>
                          setNovaCampanhaData((prev) => ({
                            ...prev,
                            responsavel: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Felipe Domingues">
                            Felipe Domingues
                          </SelectItem>
                          <SelectItem value="Vinícius Florentino">
                            Vinícius Florentino
                          </SelectItem>
                          <SelectItem value="Alex Matida">
                            Alex Matida
                          </SelectItem>
                          <SelectItem value="Guilherme Vieira">
                            Guilherme Vieira
                          </SelectItem>
                          <SelectItem value="João Gabriel">
                            João Gabriel
                          </SelectItem>
                          <SelectItem value="José Renato">
                            José Renato
                          </SelectItem>
                          <SelectItem value="Vitor Spiazzi">
                            Vitor Spiazzi
                          </SelectItem>
                          <SelectItem value="Enzo Vieira">
                            Enzo Vieira
                          </SelectItem>
                          <SelectItem value="Manoel Henrique">
                            Manoel Henrique
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="influenciador">Influenciador</Label>
                    <div className="relative">
                      <Input
                        id="influenciador"
                        placeholder="Digite o nome do influenciador..."
                        value={novaCampanhaData.influenciador}
                        onChange={(e) =>
                          setNovaCampanhaData((prev) => ({
                            ...prev,
                            influenciador: e.target.value,
                          }))
                        }
                      />
                      {influenciadoresSugeridos.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                          {influenciadoresSugeridos.map((inf, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer text-black"
                              onClick={() => {
                                setNovaCampanhaData((prev) => ({
                                  ...prev,
                                  influenciador: inf.nome,
                                }));
                                setInfluenciadoresSugeridos([]);
                              }}
                            >
                              <Avatar className="w-8 h-8">
                                <AvatarImage
                                  src={inf.foto || "/placeholder.svg"}
                                />
                                <AvatarFallback>
                                  {inf.nome
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{inf.nome}</p>
                                <p className="text-sm text-gray-500">
                                  {inf.nicho} •{" "}
                                  {(
                                    inf.seguidores?.instagram || inf.seguidores
                                  )?.toLocaleString()}{" "}
                                  seguidores
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="periodo">Período da Campanha</Label>
                      <Select
                        value={novaCampanhaData.periodo}
                        onValueChange={(value) =>
                          setNovaCampanhaData((prev) => ({
                            ...prev,
                            periodo: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mensal">Mensal (1 mês)</SelectItem>
                          <SelectItem value="trimestral">
                            Trimestral (3 meses)
                          </SelectItem>
                          <SelectItem value="semestral">
                            Semestral (6 meses)
                          </SelectItem>
                          <SelectItem value="anual">
                            Anual (12 meses)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo de Parceria</Label>
                      <Select
                        value={novaCampanhaData.tipo}
                        onValueChange={(value) =>
                          setNovaCampanhaData((prev) => ({
                            ...prev,
                            tipo: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monetaria">Monetária</SelectItem>
                          <SelectItem value="permuta">Permuta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Redes Sociais</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        "Instagram",
                        "YouTube",
                        "TikTok",
                        "X/Twitter",
                        "Twitch",
                        "Outro",
                      ].map((rede) => (
                        <div key={rede} className="flex items-center space-x-2">
                          <Checkbox
                            id={rede}
                            checked={novaCampanhaData.redes.includes(rede)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNovaCampanhaData((prev) => ({
                                  ...prev,
                                  redes: [...prev.redes, rede],
                                }));
                              } else {
                                setNovaCampanhaData((prev) => ({
                                  ...prev,
                                  redes: prev.redes.filter((r) => r !== rede),
                                }));
                              }
                            }}
                          />
                          <Label htmlFor={rede} className="text-sm">
                            {rede}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipo-insercao">Tipo de Inserção</Label>
                      <Input
                        id="tipo-insercao"
                        placeholder="Ex: Feed + Stories"
                        value={novaCampanhaData.tipoInsercao}
                        onChange={(e) =>
                          setNovaCampanhaData((prev) => ({
                            ...prev,
                            tipoInsercao: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valor">Valor (R$)</Label>
                      <Input
                        id="valor"
                        type="number"
                        placeholder="25000"
                        value={novaCampanhaData.valor}
                        onChange={(e) =>
                          setNovaCampanhaData((prev) => ({
                            ...prev,
                            valor: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="acaba-em">
                      Acaba em (opcional - para parcerias de longo prazo)
                    </Label>
                    <Input
                      id="acaba-em"
                      type="date"
                      value={novaCampanhaData.acabaEm}
                      onChange={(e) =>
                        setNovaCampanhaData((prev) => ({
                          ...prev,
                          acabaEm: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowNovaCampanha(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={criarNovaCampanha}>Criar Campanha</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card
            className={`transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={`text-sm font-medium transition-colors duration-300 ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Parcerias Ativas
              </CardTitle>
              <Users
                className={`h-4 w-4 transition-colors duration-300 ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold transition-colors duration-300 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {metricas.parceriasAtivas || 0}
              </div>
              <p
                className={`text-xs transition-colors duration-300 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                +2 desde o mês passado
              </p>
            </CardContent>
          </Card>

          <Card
            className={`transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={`text-sm font-medium transition-colors duration-300 ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Influenciadores
              </CardTitle>
              <Users
                className={`h-4 w-4 transition-colors duration-300 ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold transition-colors duration-300 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {metricas.totalInfluenciadores || 0}
              </div>
              <p
                className={`text-xs transition-colors duration-300 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                +5 novos este mês
              </p>
            </CardContent>
          </Card>

          <Card
            className={`transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={`text-sm font-medium transition-colors duration-300 ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Posts Este Mês
              </CardTitle>
              <CalendarIcon
                className={`h-4 w-4 transition-colors duration-300 ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold transition-colors duration-300 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {metricas.postagensEsteMe || 0}
              </div>
              <p
                className={`text-xs transition-colors duration-300 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Meta: {metricas.metaMensal || 0} posts
              </p>
            </CardContent>
          </Card>

          <Card
            className={`transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={`text-sm font-medium transition-colors duration-300 ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Meta Mensal
              </CardTitle>
              <Target
                className={`h-4 w-4 transition-colors duration-300 ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold transition-colors duration-300 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {Math.round(
                  ((metricas.parceriasAtivas || 0) /
                    (metricas.metaParcerias || 1)) *
                    100
                )}
                %
              </div>
              <p
                className={`text-xs transition-colors duration-300 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {metricas.parceriasAtivas || 0}/{metricas.metaParcerias || 0}{" "}
                parcerias
              </p>
            </CardContent>
          </Card>

          <Card
            className={`transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              darkMode
                ? "bg-gradient-to-br from-purple-900 to-blue-900 border-purple-700"
                : "bg-gradient-to-br from-purple-500 to-blue-600"
            }`}
          >
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                Buscar Parcerias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-white">
                <p className="text-2xl font-bold">{marcasDisponiveis.length}</p>
                <p className="text-sm opacity-90">Marcas disponíveis</p>
              </div>
              <div className="space-y-2">
                <Button variant="secondary" size="sm" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Lista de Contatos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-white border-white hover:bg-white hover:text-purple-600 bg-transparent"
                  onClick={() => setShowBuscarParcerias(true)}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Buscar Parcerias
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card
          className={`transition-all duration-300 ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
          }`}
        >
          <CardHeader>
            <CardTitle
              className={`flex items-center gap-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <CalendarIcon className="w-5 h-5" />
              Agenda da Semana
            </CardTitle>
            <CardDescription
              className={darkMode ? "text-gray-400" : "text-gray-600"}
            >
              Roteiros, conteúdos e postagens para aprovação esta semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {agendaSemana.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg transition-all duration-300 hover:shadow-md ${
                    darkMode
                      ? "border-gray-600 hover:border-gray-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={item.foto || "/placeholder.svg"} />
                      <AvatarFallback>
                        {item.influenciador
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p
                        className={`font-medium text-sm ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {item.influenciador}
                      </p>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {item.marca}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {getTipoIcon(item.tipo)}
                    <span
                      className={`text-sm font-medium capitalize ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      {item.tipo === "roteiro"
                        ? "Roteiro"
                        : item.tipo === "conteudo"
                        ? "Conteúdo"
                        : "Publicação"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={darkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      {item.data}
                    </span>
                    <div className="flex items-center gap-1">
                      {getSocialIcon(item.rede.toLowerCase())}
                      <span
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
                      >
                        {item.rede}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog
          open={showBuscarParcerias}
          onOpenChange={setShowBuscarParcerias}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Buscar Parcerias</DialogTitle>
              <DialogDescription>
                Marcas disponíveis para novas parcerias
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Tabs defaultValue="planejadas">
                <TabsList>
                  <TabsTrigger value="planejadas">Planejadas</TabsTrigger>
                  <TabsTrigger value="sem-contato">Sem Contato</TabsTrigger>
                  <TabsTrigger value="contatado">Contatadas</TabsTrigger>
                  <TabsTrigger value="historico">Com Histórico</TabsTrigger>
                </TabsList>

                {["planejadas", "sem-contato", "contatado", "historico"].map(
                  (status) => (
                    <TabsContent
                      key={status}
                      value={status}
                      className="space-y-3"
                    >
                      {marcasDisponiveis
                        .filter((marca) => marca.status === status)
                        .map((marca, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">{marca.nome}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {marca.observacoes}
                                </p>
                                {marca.contato && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Contato: {marca.contato}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Phone className="w-4 h-4 mr-1" />
                                  Contatar
                                </Button>
                                <Button size="sm">
                                  <Plus className="w-4 h-4 mr-1" />
                                  Nova Campanha
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </TabsContent>
                  )
                )}
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={showAdicionarObservacao !== null}
          onOpenChange={() => setShowAdicionarObservacao(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Observação</DialogTitle>
              <DialogDescription>
                Campanha finalizada com sucesso! Deseja adicionar alguma
                observação?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea placeholder="Digite suas observações sobre esta campanha..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAdicionarObservacao(null)}
              >
                Pular
              </Button>
              <Button onClick={() => setShowAdicionarObservacao(null)}>
                Salvar Observação
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="todas" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger
                value="todas"
                onClick={() => setFiltroStatus("todas")}
              >
                Todas
              </TabsTrigger>
              <TabsTrigger
                value="ativas"
                onClick={() => setFiltroStatus("ativa")}
              >
                Ativas
              </TabsTrigger>
              <TabsTrigger
                value="planejadas"
                onClick={() => setFiltroStatus("planejada")}
              >
                Planejadas
              </TabsTrigger>
              <TabsTrigger
                value="anteriores"
                onClick={() => setFiltroStatus("anteriores")}
              >
                Anteriores
              </TabsTrigger>
            </TabsList>
            <Dialog open={showFiltros} onOpenChange={setShowFiltros}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filtros Avançados</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Marca</Label>
                    <Select value={filtroMarca} onValueChange={setFiltroMarca}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas as marcas</SelectItem>
                        <SelectItem value="Basicamente">Basicamente</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Insider">Insider</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Responsável</Label>
                    <Select
                      value={filtroResponsavel}
                      onValueChange={setFiltroResponsavel}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="Felipe Domingues">
                          Felipe Domingues
                        </SelectItem>
                        <SelectItem value="Vinícius Florentino">
                          Vinícius Florentino
                        </SelectItem>
                        <SelectItem value="Alex Matida">Alex Matida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setShowFiltros(false)}>
                    Aplicar Filtros
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="todas" className="space-y-4">
            {parceriasFiltradas.map((parceria) => (
              <Card
                key={parceria.id}
                className={`cursor-pointer hover:shadow-md transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                    : "bg-white hover:shadow-lg"
                }`}
                onClick={() => setShowDetalhes(parceria.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {parceria.marca.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle
                          className={`text-lg ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {parceria.marca}
                          {parceria.tipo === "permuta" && (
                            <Gift className="w-4 h-4 inline ml-2 text-orange-500" />
                          )}
                        </CardTitle>
                        <CardDescription
                          className={
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          {parceria.influenciadores.length === 1
                            ? parceria.influenciadores[0].nome
                            : `${parceria.influenciadores.length} influenciadores`}
                          {parceria.periodo !== "mensal" && (
                            <span className="ml-2">
                              • Mês {parceria.mesAtual}/{parceria.totalMeses}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          parceria.status === "ativa"
                            ? "default"
                            : parceria.status === "planejada"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {parceria.status}
                      </Badge>
                      {parceria.tipo === "permuta" && (
                        <Badge
                          variant="outline"
                          className="text-orange-600 border-orange-600"
                        >
                          Permuta
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={darkMode ? "text-gray-300" : "text-gray-700"}
                      >
                        Responsável: {parceria.responsavel}
                      </span>
                      <span
                        className={darkMode ? "text-gray-300" : "text-gray-700"}
                      >
                        Iniciada em:{" "}
                        {new Date(parceria.iniciadaEm).toLocaleDateString()}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-4 text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <span>
                        Redes: {parceria.influenciadores[0]?.redes.join(", ")}
                      </span>
                      <span>Tipo: {parceria.tipoInsercao}</span>
                      <span className="capitalize">
                        Período: {parceria.periodo}
                      </span>
                    </div>

                    {parceria.periodo !== "mensal" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span
                            className={
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }
                          >
                            Progresso por mês:
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {Array.from(
                            { length: parceria.totalMeses },
                            (_, i) => {
                              const mesNum = i + 1;
                              const realizadas =
                                parceria.postagensRealizadas[
                                  `mes${mesNum}` as keyof typeof parceria.postagensRealizadas
                                ] || 0;
                              const total =
                                parceria.postagensTotal[
                                  `mes${mesNum}` as keyof typeof parceria.postagensTotal
                                ] || 4;
                              const isAtual = mesNum === parceria.mesAtual;

                              return (
                                <div
                                  key={mesNum}
                                  className={`flex-1 text-center p-2 rounded text-xs ${
                                    isAtual
                                      ? darkMode
                                        ? "bg-blue-900 text-blue-200"
                                        : "bg-blue-100 text-blue-800"
                                      : darkMode
                                      ? "bg-gray-700 text-gray-300"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  <div>Mês {mesNum}</div>
                                  <div className="font-semibold">
                                    {realizadas}/{total}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}

                    <Progress value={parceria.progresso} className="w-full" />
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={darkMode ? "text-gray-300" : "text-gray-700"}
                      >
                        Progresso: {parceria.progresso}%
                      </span>
                      <span
                        className={darkMode ? "text-gray-300" : "text-gray-700"}
                      >
                        {parceria.tipo === "monetaria"
                          ? `Valor Agência: R$ ${(
                              parceria.valorAgencia || 0
                            ).toLocaleString()}`
                          : "Parceria por Permuta"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="anteriores" className="space-y-4">
            {parceriasAnteriores.map((parceria) => (
              <Card
                key={parceria.id}
                className={`cursor-pointer hover:shadow-md transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                    : "bg-white hover:shadow-lg"
                }`}
                onClick={() => setShowParceriaAnterior(parceria)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {parceria.marca.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle
                          className={`text-lg ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {parceria.marca}
                        </CardTitle>
                        <CardDescription
                          className={
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          {(parceria.influenciadores as any[]).join(", ")}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {parceria.renovadaEm && (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          Renovada em{" "}
                          {new Date(parceria.renovadaEm).toLocaleDateString()}
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          renovarParceria(parceria.id);
                        }}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Renovar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={darkMode ? "text-gray-300" : "text-gray-700"}
                      >
                        Responsável: {parceria.responsavel}
                      </span>
                      <span
                        className={darkMode ? "text-gray-300" : "text-gray-700"}
                      >
                        Finalizada em:{" "}
                        {new Date(parceria.finalizadaEm).toLocaleDateString()}
                      </span>
                    </div>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {parceria.observacoes}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <div className="mt-8 space-y-6">
          <Card
            className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}
          >
            <CardHeader>
              <CardTitle
                className={`flex items-center gap-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                Dúvidas Frequentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger
                    className={darkMode ? "text-gray-200" : "text-gray-900"}
                  >
                    Como calcular o CPM de uma campanha?
                  </AccordionTrigger>
                  <AccordionContent
                    className={darkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    O CPM (Custo Por Mil impressões) é calculado dividindo o
                    investimento total pelo alcance e multiplicando por 1000.
                    Fórmula: (Investimento ÷ Alcance) × 1000. Um CPM entre R$
                    10-30 é considerado bom para influenciadores.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger
                    className={darkMode ? "text-gray-200" : "text-gray-900"}
                  >
                    Qual a diferença entre alcance e impressões?
                  </AccordionTrigger>
                  <AccordionContent
                    className={darkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    Alcance é o número de pessoas únicas que viram o conteúdo,
                    enquanto impressões é o número total de vezes que o conteúdo
                    foi visualizado. Uma pessoa pode gerar múltiplas impressões,
                    mas conta como apenas 1 no alcance.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger
                    className={darkMode ? "text-gray-200" : "text-gray-900"}
                  >
                    Como negociar com influenciadores?
                  </AccordionTrigger>
                  <AccordionContent
                    className={darkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    Considere o engajamento real, não apenas o número de
                    seguidores. Analise o público-alvo, histórico de parcerias e
                    qualidade do conteúdo. Negocie pacotes com múltiplas
                    entregas para obter melhores preços.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger
                    className={darkMode ? "text-gray-200" : "text-gray-900"}
                  >
                    Quando uma campanha deve ser pausada?
                  </AccordionTrigger>
                  <AccordionContent
                    className={darkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    Pause campanhas quando o engajamento estiver abaixo de 2%,
                    houver comentários muito negativos, ou quando o CPM estiver
                    50% acima da média do mercado para o nicho específico.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card
            className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}
          >
            <CardHeader>
              <CardTitle
                className={`flex items-center gap-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <Lightbulb className="w-5 h-5" />
                Dicas para Melhores Resultados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div
                  className={`p-4 border rounded-lg ${
                    darkMode ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <h4
                    className={`font-semibold mb-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    📊 Análise de Performance
                  </h4>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Monitore métricas além do alcance: taxa de cliques, tempo de
                    visualização e conversões. Use ferramentas como UTMs para
                    rastrear tráfego gerado.
                  </p>
                </div>
                <div
                  className={`p-4 border rounded-lg ${
                    darkMode ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <h4
                    className={`font-semibold mb-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    🎯 Segmentação
                  </h4>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Escolha influenciadores cujo público coincida com seu
                    target. Um micro-influenciador com público alinhado pode ser
                    mais efetivo que um macro com público genérico.
                  </p>
                </div>
                <div
                  className={`p-4 border rounded-lg ${
                    darkMode ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <h4
                    className={`font-semibold mb-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    📝 Briefing Claro
                  </h4>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Forneça briefings detalhados com objetivos, tom de voz,
                    hashtags obrigatórias e exemplos visuais. Isso reduz
                    retrabalho e melhora a qualidade.
                  </p>
                </div>
                <div
                  className={`p-4 border rounded-lg ${
                    darkMode ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <h4
                    className={`font-semibold mb-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    ⏰ Timing
                  </h4>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Publique conteúdo nos horários de maior engajamento do
                    público-alvo. Geralmente: 19h-21h para Instagram e 20h-22h
                    para TikTok.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
