import {
  Component,
  signal,
  computed,
  effect,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../../../services/chat/chat.service';

@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent {
  @ViewChild('chatMessages') chatMessages!: ElementRef<HTMLDivElement>;

  messages = signal<
    {
      id: string;
      content: string;
      isUser: boolean;
      isSkeleton?: boolean;
      type?: 'json' | 'code' | 'text';
    }[]
  >([]);
  inputMessage = signal('');
  isTyping = signal(false);
  hasMessages = computed(() => this.messages().length > 0);
  formattedResponse = signal<string>('');

  private chatService = inject(ChatService);

  constructor() {
    // Auto scroll effect
    effect(() => {
      if (this.messages().length > 0) {
        queueMicrotask(() => this.scrollToBottom());
      }
    });
  }

  async sendMessage() {
    const text = this.inputMessage().trim();
    if (!text || this.isTyping()) return;

    this.addMessage(text, true);
    this.inputMessage.set('');
    this.isTyping.set(true);

    await this.fetchBotResponse(text);
  }

  private async fetchBotResponse(input: string) {
    try {
      // show skeleton placeholder
      this.addMessage('', false, true);

      const response = await this.chatService.sendMessage(input);

      this.removeSkeletonMessage();

      const sections = this.splitLongResponse(response);
      await this.displaySections(sections);
    } catch (error: any) {
      this.removeSkeletonMessage();
      this.addMessage(`⚠️ ${error.message || 'Something went wrong.'}`, false);
    } finally {
      this.isTyping.set(false);
    }
  }

  private splitLongResponse(response: string): string[] {
    // split long responses into manageable chunks
    const maxLength = 600;
    if (!response) return [];
    const chunks: string[] = [];
    for (let i = 0; i < response.length; i += maxLength) {
      chunks.push(response.slice(i, i + maxLength));
    }
    return chunks;
  }

  private async displaySections(sections: string[]) {
    for (const section of sections) {
      await this.wait(700);
      this.addMessage(section, false);
    }
  }

  private addMessage(content: string, isUser: boolean, isSkeleton = false) {
    const type = this.detectResponseType(content);
    const id = Date.now().toString() + Math.random();
    this.messages.update((msgs) => [
      ...msgs,
      { id, content, isUser, isSkeleton, type },
    ]);
  }

  private detectResponseType(content: string): 'json' | 'code' | 'text' {
    if (!content?.trim()) return 'text';
    if (this.isJsonString(content)) return 'json';
    if (this.isCodeString(content)) return 'code';
    return 'text';
  }

  private isJsonString(str: string): boolean {
    try {
      const trimmed = str.trim();
      if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return false;
      JSON.parse(trimmed);
      return true;
    } catch {
      return false;
    }
  }

  private isCodeString(str: string): boolean {
    const codePatterns = [
      /```[\s\S]*```/,
      /function\s+\w+\s*\(/,
      /class\s+\w+/,
      /import\s+.*from/,
      /const\s+\w+\s*=/,
      /let\s+\w+\s*=/,
      /<\/?[a-z][\s\S]*>/i,
    ];
    return codePatterns.some((p) => p.test(str));
  }

  formatJson(json: string) {
    try {
      this.formattedResponse.set(JSON.stringify(JSON.parse(json), null, 2));
      return this.formattedResponse();
    } catch {
      return json;
    }
  }

  formatCode(code: string) {
    return code.replace(/```(\w+)?\n?([\s\S]*?)```/g, '$2').trim();
  }

  getCodeLanguage(code: string) {
    const match = code.match(/```(\w+)/);
    return match ? match[1] : 'code';
  }

  private removeSkeletonMessage() {
    this.messages.update((msgs) => msgs.filter((m) => !m.isSkeleton));
  }

  private scrollToBottom() {
    const el = this.chatMessages?.nativeElement;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }

  private wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  copyToClipboard(content: string) {
    navigator.clipboard.writeText(content);
  }
}
