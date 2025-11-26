import { Component, computed, input, InputSignal, model, ModelSignal, Signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { IncludePipe } from '@chronoco/pipes/include.pipe';
import { NTimesPipe } from '@chronoco/pipes/n-times.pipe';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroChevronLeft, heroChevronRight } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-pagination',
  imports: [
    NgTemplateOutlet,
    IncludePipe,
    NTimesPipe,
    NgIcon,
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
  viewProviders: [
    provideIcons({ heroChevronLeft, heroChevronRight }),
  ],
})
export class PaginationComponent {
  public totalPages: InputSignal<number> = input(1);
  public pageSize: ModelSignal<number> = model(10);
  public currentPage: ModelSignal<number> = model(1);

  public readonly isShortPagination: Signal<boolean> = computed(() => this.totalPages() <= 5);

  public readonly shownPages: Signal<number[]> = computed(() => {
    const displayCount = 3;

    const halfDisplay = Math.floor(displayCount / 2);
    let startPage = Math.max(1, this.currentPage() + 1 - halfDisplay);
    let endPage = Math.min(this.totalPages(), startPage + displayCount - 1);

    if (endPage === this.totalPages()) {
      startPage = Math.max(1, endPage - displayCount + 1);
    }

    if (startPage === 1) {
      endPage = Math.min(this.totalPages(), startPage + displayCount - 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  });

  public nextPageHandler(): void {
    if (this.currentPage() !== this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }
  }

  public previousPageHandler(): void {
    if (this.currentPage() !== 1) {
      this.currentPage.update(page => page - 1);
    }
  }

  public goToPageHandler(page: number): void {
    this.currentPage.set(page);
  }
}
