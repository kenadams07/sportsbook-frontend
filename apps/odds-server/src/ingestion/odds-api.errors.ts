export class OddsApiError extends Error{
    constructor(message:string,readonly status?:number){
        super(message);
        this.name = "OddsApiError"
    }
}

export class OddsApiAuthError extends OddsApiError{
    constructor(status:number){
        super("Odds API authentication failed",status);
        this.name = "OddsApiAuthError"
    }
}

export class OddsApiNotFoundError extends OddsApiError{
     constructor(){
        super("Odds API resource not found", 404);
        this.name = "OddsApiNotFoundError"
    }
}

export class OddsApiRateLimitError extends OddsApiError {
  constructor() {
    super("Odds API rate limit reached", 429);
    this.name = "OddsApiRateLimitError";
  }
}

export class OddsApiServerError extends OddsApiError {
  constructor(status: number) {
    super("Odds API server error", status);
    this.name = "OddsApiServerError";
  }
}
