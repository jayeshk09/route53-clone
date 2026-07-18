from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse


async def error_handler(request: Request, call_next):
    try:
        return await call_next(request)
    except HTTPException as exc:
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": {
                    "code": _code_from_status(exc.status_code),
                    "message": exc.detail,
                },
            },
        )
    except Exception as exc:
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": {
                    "code": "INTERNAL_ERROR",
                    "message": "An unexpected error occurred",
                },
            },
        )


def _code_from_status(status: int) -> str:
    codes = {
        400: "VALIDATION_ERROR",
        401: "UNAUTHENTICATED",
        403: "UNAUTHORIZED",
        404: "NOT_FOUND",
        409: "CONFLICT",
        429: "RATE_LIMITED",
    }
    return codes.get(status, "INTERNAL_ERROR")