import { useState, useEffect } from "react";
import { X, ShieldCheck, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface TermsOfUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  isSeniorMode?: boolean;
  isSubmitting?: boolean;
}

export default function TermsOfUseModal({
  isOpen,
  onClose,
  onAccept,
  isSeniorMode = false,
  isSubmitting = false,
}: TermsOfUseModalProps) {
  const [accepted, setAccepted] = useState(false);

  // Reset checkbox when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setAccepted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        className={`bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden my-6 flex flex-col max-h-[90vh] ${
          isSeniorMode ? "border-2 border-primary" : ""
        }`}
      >
        {/* Header */}
        <div className="bg-primary p-5 text-primary-foreground flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-foreground/10">
              <ShieldCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className={`font-bold ${isSeniorMode ? "text-2xl" : "text-lg"}`}>
                Termos e Condições de Uso
              </h2>
              <p className={`text-primary-foreground/80 ${isSeniorMode ? "text-base" : "text-xs"}`}>
                Leia e aceite os termos antes de publicar seu anúncio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors disabled:opacity-50"
            title="Fechar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Terms Text Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-card-foreground">
          <div className="bg-muted/40 p-4 rounded-xl border border-border text-xs sm:text-sm leading-relaxed space-y-4">
            <div className="border-b border-border pb-3">
              <h3 className="font-extrabold text-base text-primary uppercase tracking-wide flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary shrink-0" />
                TERMOS E CONDIÇÕES DE USO – VIZIGO
              </h3>
              <p className="mt-2 text-muted-foreground">
                Estes Termos e Condições de Uso regulamentam o acesso e a utilização da plataforma{" "}
                <strong>viziGO</strong> ("Plataforma"), um ambiente virtual independente voltado
                exclusivamente para facilitar o desapego de itens seminovos entre vizinhos e a divulgação de
                cupons/benefícios do comércio local.
              </p>
              <p className="mt-2 text-muted-foreground">
                Ao acessar, cadastrar-se ou utilizar a Plataforma, o usuário ("Morador" ou "Anunciante") declara ter
                lido, compreendido e concordado integralmente com as regras abaixo.
              </p>
            </div>

            {/* Seção 1 */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-foreground text-sm sm:text-base">1. DA NATUREZA DA PLATAFORMA</h4>
              <p className="text-muted-foreground pl-2">
                <strong>1.1.</strong> O viziGO é uma ferramenta tecnológica de classificados de caráter
                estritamente informal, particular e independente.
              </p>
              <p className="text-muted-foreground pl-2">
                <strong>1.2.</strong> A Plataforma não possui vínculo oficial com a administração, gestão,
                síndica(o) ou com a pessoa jurídica do condomínio, funcionando como um canal autônomo de economia
                circular e proximidade entre os moradores.
              </p>
              <p className="text-muted-foreground pl-2">
                <strong>1.3.</strong> O uso da Plataforma é totalmente gratuito para os moradores, não gerando
                qualquer tipo de ônus, despesa ou obrigatoriedade para a administração do condomínio.
              </p>
            </div>

            {/* Seção 2 */}
            <div className="space-y-1.5 border-t border-border/50 pt-3">
              <h4 className="font-bold text-foreground text-sm sm:text-base">2. DO CADASTRO E SEGURANÇA</h4>
              <p className="text-muted-foreground pl-2">
                <strong>2.1.</strong> O acesso aos recursos de anúncio e negociação é restrito a moradores devidamente
                comprovados do condomínio.
              </p>
              <p className="text-muted-foreground pl-2">
                <strong>2.2.</strong> O usuário é o único responsável pela veracidade dos dados informados no momento do
                cadastro e pela segurança de sua conta, comprometendo-se a não repassar suas credenciais de acesso a
                terceiros.
              </p>
            </div>

            {/* Seção 3 */}
            <div className="space-y-1.5 border-t border-border/50 pt-3">
              <h4 className="font-bold text-foreground text-sm sm:text-base">3. DAS REGRAS PARA ANÚNCIOS (DESAPEGOS)</h4>
              <p className="text-muted-foreground pl-2">
                <strong>3.1.</strong> O viziGO atua exclusivamente como intermediário tecnológico de anúncio,
                não participando, endossando ou garantindo qualquer transação financeira, entrega, troca ou qualidade dos
                produtos negociados entre os usuários.
              </p>
              <p className="text-muted-foreground pl-2 font-medium text-foreground">
                <strong>3.2. É estritamente proibido o anúncio de:</strong>
              </p>
              <ul className="list-disc pl-8 space-y-1 text-muted-foreground">
                <li>Produtos ilícitos, roubados, falsificados ou de comercialização proibida pela legislação brasileira.</li>
                <li>Armas de fogo, munições, substâncias entorpecentes ou itens perigosos.</li>
                <li>Conteúdos de natureza sexual, discriminatória, ofensiva ou que violem os direitos de terceiros.</li>
              </ul>
              <p className="text-muted-foreground pl-2 pt-1">
                <strong>3.3.</strong> As negociações de pagamento e entrega (retirada) são de inteira e exclusiva
                responsabilidade dos usuários envolvidos, recomendando-se sempre cautela e locais seguros nas
                dependências comuns do condomínio.
              </p>
            </div>

            {/* Seção 4 */}
            <div className="space-y-1.5 border-t border-border/50 pt-3">
              <h4 className="font-bold text-foreground text-sm sm:text-base">4. DA ISENÇÃO DE RESPONSABILIDADE</h4>
              <p className="text-muted-foreground pl-2 font-medium text-foreground">
                <strong>4.1. Os desenvolvedores e administradores da Plataforma não se responsabilizam por:</strong>
              </p>
              <ul className="list-disc pl-8 space-y-1 text-muted-foreground">
                <li>
                  Prejuízos financeiros, calotes, desacordos comerciais ou danos materiais decorrentes das negociações
                  realizadas entre os moradores.
                </li>
                <li>Condutas inadequados, fraudes ou má-fé praticadas por usuários cadastrados.</li>
              </ul>
              <p className="text-muted-foreground pl-2 pt-1">
                <strong>4.2.</strong> A Plataforma reserva-se o direito de remover, a qualquer momento e sem aviso
                prévio, qualquer anúncio que infrinja estes Termos ou a legislação vigente.
              </p>
            </div>

            {/* Seção 5 */}
            <div className="space-y-1.5 border-t border-border/50 pt-3">
              <h4 className="font-bold text-foreground text-sm sm:text-base">5. DA MODIFICAÇÃO DOS TERMOS</h4>
              <p className="text-muted-foreground pl-2">
                <strong>5.1.</strong> Os administradores do viziGO poderão alterar estes Termos de Uso a qualquer
                momento, visando a melhoria contínua da ferramenta. As atualizações passarão a valer imediatamente após
                sua publicação no sistema.
              </p>
            </div>

            <div className="pt-2 text-right text-xs font-semibold text-muted-foreground border-t border-border/50">
              Última atualização: Junho de 2026.
            </div>
          </div>

          {/* Acceptance Box */}
          <div className="flex items-start space-x-3 p-3.5 bg-primary/5 rounded-xl border border-primary/20">
            <Checkbox
              id="accept-terms"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(!!checked)}
              className="mt-0.5"
            />
            <label
              htmlFor="accept-terms"
              className={`font-semibold text-foreground cursor-pointer select-none ${
                isSeniorMode ? "text-base" : "text-xs sm:text-sm"
              }`}
            >
              Declaro que li, compreendi e aceito integralmente os Termos e Condições de Uso para anunciar na
              plataforma viziGO.
            </label>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-muted/30 p-4 border-t border-border flex items-center justify-end gap-3 shrink-0">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar / Voltar
          </Button>
          <Button
            type="button"
            variant="hero"
            disabled={!accepted || isSubmitting}
            onClick={onAccept}
            className={`font-bold flex items-center gap-2 ${
              isSeniorMode ? "h-14 px-8 text-xl" : "h-10 px-6"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Publicando anúncio...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                <span>Concordar e Publicar Anúncio</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
