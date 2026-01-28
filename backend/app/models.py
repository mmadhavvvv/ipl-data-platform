from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Team(Base):
    __tablename__ = "teams"
    tid = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    abbr = Column(String(20), nullable=False)
    alt_name = Column(String(100))
    logo_url = Column(Text)
    thumb_url = Column(Text)

class Venue(Base):
    __tablename__ = "venues"
    venue_id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    location = Column(String(255))
    country = Column(String(100))
    timezone = Column(String(50))

class Match(Base):
    __tablename__ = "matches"
    match_id = Column(Integer, primary_key=True)
    title = Column(String(255))
    short_title = Column(String(100))
    subtitle = Column(String(100))
    match_number = Column(String(50))
    date_start = Column(DateTime)
    date_end = Column(DateTime)
    venue_id = Column(Integer, ForeignKey("venues.venue_id"))
    teama_id = Column(Integer, ForeignKey("teams.tid"))
    teamb_id = Column(Integer, ForeignKey("teams.tid"))
    winning_team_id = Column(Integer, ForeignKey("teams.tid"), nullable=True)
    status_str = Column(String(50))
    status_note = Column(Text)
    result = Column(Text)
    win_margin = Column(String(100))
    toss_winner_id = Column(Integer, ForeignKey("teams.tid"), nullable=True)
    toss_decision = Column(Integer) # 1 for bat, 2 for bowl (per dataset)

    venue = relationship("Venue")
    teama = relationship("Team", foreign_keys=[teama_id])
    teamb = relationship("Team", foreign_keys=[teamb_id])
    winning_team = relationship("Team", foreign_keys=[winning_team_id])

class Standing(Base):
    __tablename__ = "standings"
    id = Column(Integer, primary_key=True, autoincrement=True)
    team_id = Column(Integer, ForeignKey("teams.tid"))
    played = Column(Integer)
    win = Column(Integer)
    loss = Column(Integer)
    nr = Column(Integer)
    points = Column(Integer)
    netrr = Column(Float)
    
    team = relationship("Team")

class PlayerStat(Base):
    __tablename__ = "player_stats"
    id = Column(Integer, primary_key=True, autoincrement=True)
    player_id = Column(Integer) # Can link to a Player model later if needed
    name = Column(String(255))
    team_abbr = Column(String(20))
    runs = Column(Integer, default=0)
    wickets = Column(Integer, default=0)
    average = Column(Float)
    strike_rate = Column(Float)
    stat_type = Column(String(50)) # 'batting' or 'bowling'
