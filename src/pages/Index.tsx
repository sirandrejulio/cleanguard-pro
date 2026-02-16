import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Video,
  MapPin,
  Activity,
  ShieldAlert,
  Plus,
  Shield
} from "lucide-react";

// Isometric Grid Component
const IsometricGrid = () => {
  const [cells, setCells] = useState<number[]>([]);

  useEffect(() => {
    // Generate 100 cells
    setCells(Array.from({ length: 100 }, (_, i) => i));
  }, []);

  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full md:w-[50%] h-[800px] opacity-30 md:opacity-100 pointer-events-none md:pointer-events-auto overflow-visible z-0">
      <div className="w-full h-full flex items-center justify-center perspective-[1200px]">
        <div className="iso-container w-[600px] h-[600px] grid grid-cols-10 gap-1 p-4 border border-zinc-200 bg-white/10 backdrop-blur-sm">
          {cells.map((i) => {
            const isPulse = Math.random() > 0.9;
            return (
              <div
                key={i}
                className={`iso-cell w-full h-full border border-zinc-200/50 ${isPulse ? 'pulse-cell' : 'bg-white/5'}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-zinc-100 selection:bg-brand-emerald selection:text-white font-body text-zinc-900 overflow-x-hidden">

      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[999] bg-noise opacity-[0.03] mix-blend-overlay"></div>

      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
        <div className="glass hairline flex items-center justify-between p-3 rounded-sm shadow-sm">
          {/* Logo */}
          <div className="flex items-center pl-4 pr-6 hairline-r gap-3">
            <Shield className="w-5 h-5 text-brand-emerald" />
            <span className="font-display font-semibold tracking-[-0.05em] text-lg">
              CLEAN GUARD <span className="text-brand-emerald">PRO</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-0 h-full">
            {['Proteção', 'Rotas', 'Casos de Uso', 'Planos'].map((item, i) => (
              <div key={item} className="flex items-center h-full">
                <a href="#" className="group relative px-6 py-2 block font-mono text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-950 transition-colors">
                  <span className="absolute inset-0 bg-zinc-200 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200 -z-10"></span>
                  {item}
                </a>
                {i < 3 && <div className="w-px h-4 bg-zinc-200"></div>}
              </div>
            ))}
          </div>

          {/* CTA */}
          <button className="bg-zinc-950 text-white px-5 py-2 text-xs font-mono uppercase tracking-wide hover:bg-brand-emerald transition-colors duration-200">
            Acesso Restrito
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col md:flex-row items-center justify-between pt-32 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto overflow-hidden">

        {/* Typography */}
        <div className="w-full md:w-3/5 z-10 flex flex-col gap-8">
          <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-emerald animate-pulse"></span>
            // GESTÃO OPERACIONAL INTELIGENTE V.2.0
          </div>

          <h1 className="text-hero font-display font-semibold leading-[0.9] tracking-[-0.04em] text-zinc-950">
            DOMINE A OPERAÇÃO<br />
            <span className="text-zinc-400">ANTES DO PROBLEMA.</span>
          </h1>

          <p className="font-body text-base md:text-lg text-zinc-500 max-w-xl leading-relaxed">
            O Clean Guard Pro utiliza monitoramento GPS e evidência digital em tempo real para blindar sua empresa de facilities contra disputas trabalhistas e falhas operacionais.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-4">
            <button className="group flex items-center gap-3 bg-zinc-950 text-white pl-6 pr-4 py-4 hover:bg-brand-emerald transition-colors duration-300">
              <span className="font-mono text-sm uppercase tracking-wide">Iniciar Proteção</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="#" className="font-mono text-sm text-zinc-500 border-b border-zinc-300 hover:text-zinc-950 hover:border-zinc-950 transition-all pb-1">
              Ler o Relatório de Riscos
            </a>
          </div>
        </div>

        {/* Isometric Visual */}
        <IsometricGrid />
      </section>

      {/* Marquee Social Proof */}
      <section className="border-y border-zinc-200 bg-white py-4 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 bg-white z-10 px-4 flex items-center border-r border-zinc-200">
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">TRUSTED_ENTITIES:</span>
        </div>

        <div className="marquee-container w-full">
          <div className="marquee-content flex gap-12 items-center pl-48 min-w-max">
            {[
              { name: "ISS FACILITIES", status: "Protegido", color: "text-brand-emerald bg-brand-emerald/10" },
              { name: "SODEXO", status: "Ativo: 99%", color: "text-brand-blue bg-brand-blue/10" },
              { name: "GRUPO GPS", status: "Monitorando", color: "text-zinc-500 bg-zinc-100" },
              { name: "VERZANI & SANDRINI", status: "Risco: Baixo", color: "text-brand-emerald bg-brand-emerald/10" },
              { name: "LIMPEZA TOTAL", status: "Alerta: Verificando", color: "text-brand-red bg-brand-red/10" },
              { name: "BRASANITAS", status: "Otimizando", color: "text-brand-blue bg-brand-blue/10" },
              // Duplicate for loop
              { name: "ISS FACILITIES", status: "Protegido", color: "text-brand-emerald bg-brand-emerald/10" },
              { name: "SODEXO", status: "Ativo: 99%", color: "text-brand-blue bg-brand-blue/10" },
              { name: "GRUPO GPS", status: "Monitorando", color: "text-zinc-500 bg-zinc-100" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                <span className="font-display font-semibold text-lg tracking-tight">{item.name}</span>
                <span className={`font-mono text-[10px] px-1 py-0.5 ${item.color}`}>[{item.status}]</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="mb-12 flex items-baseline justify-between border-b border-zinc-200 pb-4">
          <h2 className="text-section font-display font-medium tracking-tight text-zinc-950">SHIELD SYSTEM</h2>
          <span className="font-mono text-xs text-zinc-400 hidden sm:block">GRID_SYSTEM_V.01</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200">
          {/* Large Card */}
          <div className="md:col-span-2 md:row-span-2 bg-white p-8 md:p-12 group relative overflow-hidden h-full min-h-[400px]">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-brand-emerald translate-y-[-100%] group-hover:translate-y-[600px] transition-transform duration-[1.5s] ease-in-out z-10"></div>
            <div className="flex flex-col justify-between h-full relative z-0">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <Video className="w-8 h-8 text-zinc-300 group-hover:text-brand-emerald transition-colors duration-300" strokeWidth={1.5} />
                  <span className="font-mono text-[10px] text-zinc-400">01</span>
                </div>
                <h3 className="font-mono text-sm uppercase tracking-wider mb-4 group-hover:text-brand-emerald transition-colors">Evidência Digital</h3>
                <p className="font-body text-2xl text-zinc-800 leading-tight">
                  Registre inspeções com vídeo geo-localizado e timestamp blockchain. Elimine o "disse-me-disse" com prova irrefutável.
                </p>
              </div>
              <div className="mt-8 pt-8 border-t border-zinc-100 flex gap-4 font-mono text-[10px] text-zinc-400">
                <span>DATA_SOURCE: GPS+CAM</span>
                <span>UPDATE: REAL-TIME</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 group relative overflow-hidden h-64">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-brand-emerald translate-y-[-100%] group-hover:translate-y-[400px] transition-transform duration-[1s] ease-in-out delay-100 z-10"></div>
            <div className="flex justify-between items-start mb-4">
              <MapPin className="w-6 h-6 text-zinc-300 group-hover:text-brand-emerald transition-colors" strokeWidth={1.5} />
              <span className="font-mono text-[10px] text-zinc-400">02</span>
            </div>
            <h3 className="font-mono text-sm uppercase tracking-wider mb-2 group-hover:text-brand-emerald transition-colors">Monitoramento de Rota</h3>
            <p className="font-body text-sm text-zinc-500">Rastreio de equipes em tempo real com alertas de desvio.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 group relative overflow-hidden h-64">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-brand-emerald translate-y-[-100%] group-hover:translate-y-[400px] transition-transform duration-[1s] ease-in-out delay-200 z-10"></div>
            <div className="flex justify-between items-start mb-4">
              <Activity className="w-6 h-6 text-zinc-300 group-hover:text-brand-emerald transition-colors" strokeWidth={1.5} />
              <span className="font-mono text-[10px] text-zinc-400">03</span>
            </div>
            <h3 className="font-mono text-sm uppercase tracking-wider mb-2 group-hover:text-brand-emerald transition-colors">Performance Operacional</h3>
            <p className="font-body text-sm text-zinc-500">Métricas de tempo de atendimento e qualidade de serviço.</p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-8 group relative overflow-hidden h-64">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-brand-emerald translate-y-[-100%] group-hover:translate-y-[400px] transition-transform duration-[1s] ease-in-out delay-300 z-10"></div>
            <div className="flex justify-between items-start mb-4">
              <ShieldAlert className="w-6 h-6 text-zinc-300 group-hover:text-brand-emerald transition-colors" strokeWidth={1.5} />
              <span className="font-mono text-[10px] text-zinc-400">04</span>
            </div>
            <h3 className="font-mono text-sm uppercase tracking-wider mb-2 group-hover:text-brand-emerald transition-colors">Alertas de Risco</h3>
            <p className="font-body text-sm text-zinc-500">Notificações automáticas quando um posto fica descoberto.</p>
          </div>
        </div>
      </section>

      {/* Asset Intelligence (Showcase) */}
      <section className="py-12 bg-zinc-100 border-t border-zinc-200">
        <div className="px-6 md:px-12 max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-section font-display font-medium tracking-tight text-zinc-950 mb-2">PROVAS REAIS</h2>
              <p className="font-body text-zinc-500">Operações blindadas pela inteligência Clean Guard.</p>
            </div>
            <button className="border border-zinc-300 bg-white px-6 py-3 font-mono text-xs uppercase hover:bg-zinc-950 hover:text-white transition-colors">
              Ver Base de Dados
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project 1 */}
            <div className="group relative aspect-[4/5] overflow-hidden cursor-crosshair">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" alt="Corporate" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out" />
              <div className="absolute inset-0 border border-zinc-200/20 group-hover:border-white/50 transition-colors z-10"></div>
              <div className="absolute bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-zinc-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-mono text-xs uppercase font-bold">Torre Empresarial Sul</h3>
                  <span className="text-brand-emerald font-mono text-xs">100% Coberto</span>
                </div>
                <div className="flex gap-2 text-[10px] font-mono text-zinc-500">
                  <span className="border border-zinc-200 px-1">CORPORATIVO</span>
                  <span className="border border-zinc-200 px-1">RISCO: ZERO</span>
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="group relative aspect-[4/5] overflow-hidden cursor-crosshair">
              <img src="https://images.unsplash.com/photo-1581578731117-10d52143b0d8?q=80&w=2074&auto=format&fit=crop" alt="Industrial" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out" />
              <div className="absolute inset-0 border border-zinc-200/20 group-hover:border-white/50 transition-colors z-10"></div>
              <div className="absolute bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-zinc-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-mono text-xs uppercase font-bold">Galpão Logístico A</h3>
                  <span className="text-brand-emerald font-mono text-xs">-15% Custos</span>
                </div>
                <div className="flex gap-2 text-[10px] font-mono text-zinc-500">
                  <span className="border border-zinc-200 px-1">INDUSTRIAL</span>
                  <span className="border border-zinc-200 px-1">EFICIÊNCIA: ALTA</span>
                </div>
              </div>
            </div>

            {/* Project 3 */}
            <div className="group relative aspect-[4/5] overflow-hidden cursor-crosshair">
              <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" alt="Security" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out" />
              <div className="absolute inset-0 border border-zinc-200/20 group-hover:border-white/50 transition-colors z-10"></div>
              <div className="absolute bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-zinc-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-mono text-xs uppercase font-bold">Shopping Center Leste</h3>
                  <span className="text-brand-emerald font-mono text-xs">Sem Incidentes</span>
                </div>
                <div className="flex gap-2 text-[10px] font-mono text-zinc-500">
                  <span className="border border-zinc-200 px-1">VAREJO</span>
                  <span className="border border-zinc-200 px-1 text-brand-red">RISCO: MÉDIO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex justify-center mb-16">
          <div className="inline-flex items-center bg-zinc-200 p-1 rounded-sm border border-zinc-300">
            <button className="px-6 py-1 bg-white shadow-sm text-xs font-mono uppercase">Mensal</button>
            <button className="px-6 py-1 text-zinc-500 text-xs font-mono uppercase hover:text-zinc-950">Anual</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Basic */}
          <div className="bg-white border border-zinc-200 p-8 flex flex-col gap-6">
            <div>
              <h3 className="font-mono text-sm uppercase text-zinc-500 mb-2">INICIAL</h3>
              <div className="font-display text-4xl font-semibold">R$ 500<span className="text-lg text-zinc-400 font-normal">/mês</span></div>
            </div>
            <ul className="space-y-3 font-mono text-xs text-zinc-600">
              <li className="flex items-center gap-2"><Check className="w-3 h-3 text-zinc-400" /> Até 5 Usuários</li>
              <li className="flex items-center gap-2"><Check className="w-3 h-3 text-zinc-400" /> Relatórios Básicos</li>
              <li className="flex items-center gap-2"><Check className="w-3 h-3 text-zinc-400" /> Rastreamento 9h-18h</li>
            </ul>
            <button className="w-full py-3 border border-zinc-200 font-mono text-xs uppercase hover:bg-zinc-50 transition-colors">Selecionar</button>
          </div>

          {/* Pro (Hero) */}
          <div className="bg-zinc-50/50 border border-brand-emerald p-8 flex flex-col gap-6 relative min-h-[480px] justify-center shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <div className="absolute top-0 right-0 bg-brand-emerald text-white text-[10px] font-mono px-2 py-1 uppercase tracking-widest">Recomendado</div>
            <div>
              <h3 className="font-mono text-sm uppercase text-brand-emerald mb-2">PROFISSIONAL</h3>
              <div className="font-display text-4xl font-semibold">R$ 1.200<span className="text-lg text-zinc-400 font-normal">/mês</span></div>
            </div>
            <ul className="space-y-4 font-mono text-xs text-zinc-800">
              <li className="flex items-center gap-2"><Check className="w-3 h-3 text-brand-emerald" /> 15 Usuários</li>
              <li className="flex items-center gap-2"><Check className="w-3 h-3 text-brand-emerald" /> Alertas em Tempo Real</li>
              <li className="flex items-center gap-2"><Check className="w-3 h-3 text-brand-emerald" /> Armazenamento Ilimitado</li>
              <li className="flex items-center gap-2"><Check className="w-3 h-3 text-brand-emerald" /> Gerente de Conta Dedicado</li>
            </ul>
            <button className="w-full py-3 bg-brand-emerald text-white font-mono text-xs uppercase hover:bg-emerald-600 transition-colors mt-4">Iniciar Teste Grátis</button>
          </div>

          {/* Enterprise */}
          <div className="bg-white border border-zinc-200 p-8 flex flex-col gap-6">
            <div>
              <h3 className="font-mono text-sm uppercase text-zinc-500 mb-2">CORPORATIVO</h3>
              <div className="font-display text-4xl font-semibold">Custom</div>
            </div>
            <ul className="space-y-3 font-mono text-xs text-zinc-600">
              <li className="flex items-center gap-2"><Check className="w-3 h-3 text-zinc-400" /> Acesso White-label</li>
              <li className="flex items-center gap-2"><Check className="w-3 h-3 text-zinc-400" /> Implementação On-Premise</li>
              <li className="flex items-center gap-2"><Check className="w-3 h-3 text-zinc-400" /> API Full Access</li>
            </ul>
            <button className="w-full py-3 border border-zinc-200 font-mono text-xs uppercase hover:bg-zinc-50 transition-colors">Falar com Vendas</button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 md:px-12 max-w-[800px] mx-auto">
        <div className="mb-12 border-b border-zinc-200 pb-4">
          <h2 className="text-2xl font-display font-medium tracking-tight text-zinc-950">ESPECIFICAÇÕES TÉCNICAS</h2>
        </div>

        <div className="space-y-0">
          <details className="group border-b border-zinc-200">
            <summary className="flex justify-between items-center py-6 cursor-pointer list-none hover:bg-white transition-colors px-2">
              <span className="font-mono text-sm text-zinc-800">Quais formatos de exportação são suportados?</span>
              <span className="transform transition-transform duration-300 group-open:rotate-45">
                <Plus className="w-4 h-4 text-zinc-400" />
              </span>
            </summary>
            <div className="pb-6 px-2 text-zinc-500 font-body text-sm leading-relaxed">
              Suportamos exportação direta para JSON, CSV e integração nativa com SAP e PowerBI.
            </div>
          </details>
          <details className="group border-b border-zinc-200">
            <summary className="flex justify-between items-center py-6 cursor-pointer list-none hover:bg-white transition-colors px-2">
              <span className="font-mono text-sm text-zinc-800">Qual a precisão do GPS?</span>
              <span className="transform transition-transform duration-300 group-open:rotate-45">
                <Plus className="w-4 h-4 text-zinc-400" />
              </span>
            </summary>
            <div className="pb-6 px-2 text-zinc-500 font-body text-sm leading-relaxed">
              Utilizamos triangulação híbrida (GPS + Wi-Fi) com precisão de 3 a 5 metros em ambientes externos.
            </div>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-100 border-t border-zinc-200 pt-20 pb-0 relative overflow-hidden">
        <div className="px-6 md:px-12 max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-12 mb-32 z-10 relative">
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-xs uppercase text-zinc-400 mb-2">[Plataforma]</h4>
            <a href="#" className="text-sm text-zinc-600 hover:text-zinc-950">Visão Geral</a>
            <a href="#" className="text-sm text-zinc-600 hover:text-zinc-950">Funcionalidades</a>
            <a href="#" className="text-sm text-zinc-600 hover:text-zinc-950">API Docs</a>
          </div>
          <div className="hidden md:block"></div> {/* Spacer */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-mono text-xs uppercase text-zinc-400 mb-4">O mercado não espera.</h4>
            <form className="flex flex-col gap-2">
              <input type="email" placeholder="Email Corporativo" className="bg-white border border-zinc-200 p-2 text-sm font-mono focus:outline-none focus:border-zinc-950 placeholder:text-zinc-300" />
              <button type="button" className="bg-zinc-950 text-white py-2 px-4 text-xs font-mono uppercase hover:bg-brand-emerald transition-colors">Inscrever-se</button>
            </form>
          </div>
        </div>

        <div className="px-6 md:px-12 max-w-[1600px] mx-auto border-t border-zinc-200 py-6 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <p className="font-mono text-[10px] text-zinc-400 uppercase">© 2026 Clean Guard Pro. Todos os direitos reservados.</p>
          <p className="font-mono text-[10px] text-zinc-400 uppercase">Proteção Legal e Operacional.</p>
        </div>

        <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none z-0">
          <h1 className="font-display font-bold text-[15vw] leading-none tracking-tighter text-zinc-950 opacity-[0.03]">CLEANGUARD</h1>
        </div>
      </footer>
    </div>
  );
};

export default Index;
