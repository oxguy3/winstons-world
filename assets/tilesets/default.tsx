<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.2" tiledversion="1.2.5" name="default" tilewidth="32" tileheight="32" spacing="2" margin="1" tilecount="32" columns="8">
 <image source="default.png" width="272" height="136"/>
 <tile id="0" type="dirt">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="1" type="portal">
  <properties>
   <property name="collides" type="bool" value="false"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="2" type="grass_T">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="3" type="ice">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="true"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="4" type="arrow-up">
  <properties>
   <property name="collides" type="bool" value="false"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="5" type="crate">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="6" type="spike">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="7" type="lava">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="8" type="grass_TLRB">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="9" type="grass_TLB">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="10">
  <properties>
   <property name="collides" type="bool" value="false"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
  <objectgroup draworder="index">
   <object id="2" x="0" y="32">
    <polygon points="0,0 32,0 16,-31.875"/>
   </object>
  </objectgroup>
 </tile>
 <tile id="11" type="grass_L">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="12" type="grass_TR">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="13" type="grass_TRB">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="14" type="grass_TL">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="15" type="grass_R">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="16" type="rockspikes">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="17" type="sidewalk">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="18" type="stone">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="19" type="brokenstone_B">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="20" type="brokenstone_L">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="21" type="brokenstone_R">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="22" type="window">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="23" type="woodplanks">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="24" type="deadgrass_T">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="25" type="deadgrass_TLRB">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="26">
  <properties>
   <property name="collides" type="bool" value="false"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="27">
  <properties>
   <property name="collides" type="bool" value="false"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="28">
  <properties>
   <property name="collides" type="bool" value="false"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="29">
  <properties>
   <property name="collides" type="bool" value="false"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="30">
  <properties>
   <property name="collides" type="bool" value="false"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="31">
  <properties>
   <property name="collides" type="bool" value="false"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
</tileset>
