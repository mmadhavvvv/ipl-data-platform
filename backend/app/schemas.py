from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Team(BaseModel):
    tid: int
    title: str
    abbr: str
    logo_url: Optional[str]
    thumb_url: Optional[str]

    class Config:
        from_attributes = True

class Venue(BaseModel):
    venue_id: int
    name: str
    location: Optional[str]
    country: Optional[str]

    class Config:
        from_attributes = True

class Match(BaseModel):
    match_id: int
    title: Optional[str]
    match_number: Optional[str]
    date_start: Optional[datetime]
    venue: Optional[Venue]
    teama: Team
    teamb: Team
    winning_team: Optional[Team]
    status_str: Optional[str]
    result: Optional[str]

    class Config:
        from_attributes = True

class MatchList(BaseModel):
    total: int
    matches: List[Match]

class Standing(BaseModel):
    team: Team
    played: int
    win: int
    loss: int
    nr: int
    points: int
    netrr: float

    class Config:
        from_attributes = True

class PlayerStat(BaseModel):
    name: str
    team_abbr: str
    runs: Optional[int] = 0
    wickets: Optional[int] = 0
    average: Optional[float] = 0
    strike_rate: Optional[float] = 0
    stat_type: str

    class Config:
        from_attributes = True
