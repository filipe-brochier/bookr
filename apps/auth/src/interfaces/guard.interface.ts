import { ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs/internal/Observable';

export interface Guard {
  canActivate: (
    context: ExecutionContext,
  ) => boolean | Promise<boolean> | Observable<boolean>;
}
