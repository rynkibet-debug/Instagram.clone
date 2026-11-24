import React, { useState } from 'react';
import {
  SafeAreaView, ScrollView, View, Text, Image, Pressable, StatusBar,
  StyleSheet, Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { WebView } from 'react-native-webview';

const ink = '#191918';
const muted = '#888781';
const stories = [
  { name: 'Your story', color: '#e4c7a3', own: true },
  { name: 'maya', color: '#e9a596' },
  { name: 'leo.jpg', color: '#b5c9a8' },
  { name: 'sana', color: '#d5b2ca' },
  { name: 'noah', color: '#9ebaca' },
  { name: 'elle', color: '#e5c278' },
];
const posts = [
  { name: 'maya.rose', place: 'Nairobi, Kenya', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop', image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1000&h=1100&fit=crop', caption: 'A slower kind of Sunday ☀️', likes: '2,481' },
  { name: 'leo.jpg', place: 'Somewhere in the hills', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&h=1100&fit=crop', caption: 'The long way was the right way.', likes: '986' },
  { name: 'sana.creates', place: 'Studio notes', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop', image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1000&h=1100&fit=crop', caption: 'Little corners that feel like home.', likes: '1,203' },
];
const tabs = [ ['⌂','Home'], ['⌕','Search'], ['＋','Create'], ['▶','Reels'], ['◉','You'] ];

function Section({ name }) {
  if (name === 'Search') return <View style={styles.page}><Text style={styles.pageTitle}>Discover</Text><View style={styles.searchBox}><Text style={styles.searchHint}>⌕   Search people and places</Text></View><Text style={styles.pageNote}>A quieter corner of the internet.</Text><View style={styles.discoverGrid}>{posts.concat(posts).map((post, i) => <Image key={i} source={{ uri: post.image }} style={styles.gridImage} />)}</View></View>;
  if (name === 'Create') return <View style={styles.page}><Text style={styles.pageTitle}>Create</Text><View style={styles.createCard}><Text style={styles.createIcon}>＋</Text><Text style={styles.createTitle}>Start with a moment</Text><Text style={styles.pageNote}>Choose a photo or video from your library to begin a post.</Text><Pressable style={styles.primaryButton}><Text style={styles.primaryButtonText}>Choose from library</Text></Pressable></View></View>;
  if (name === 'Reels') return <View style={styles.page}><Text style={styles.pageTitle}>Reels</Text><View style={styles.reelCard}><Image source={{ uri: posts[1].image }} style={styles.reelImage}/><View style={styles.reelOverlay}><Text style={styles.reelPlay}>▷</Text><Text style={styles.reelCaption}>Small moments, big skies · {posts[1].name}</Text></View></View><Text style={styles.pageNote}>A sample reel preview</Text></View>;
  if (name === 'You') return <View style={styles.page}><View style={styles.profileHeader}><View style={styles.profileAvatar}><Text style={styles.profileInitial}>Y</Text></View><View style={styles.profileStats}><Text style={styles.profileName}>your space</Text><Text style={styles.pageNote}>Your profile preview</Text></View></View><View style={styles.profileBio}><Text style={styles.username}>Your name</Text><Text style={styles.pageNote}>Collecting little moments ✨</Text></View><Pressable style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Edit profile</Text></Pressable><Text style={styles.sectionTitle}>Your posts</Text><View style={styles.discoverGrid}>{posts.map((post, i) => <Image key={i} source={{ uri: post.image }} style={styles.gridImage}/>)}</View></View>;
  return null;
}

function Story({ item, selected, onPress }) {
  return <Pressable style={styles.story} onPress={onPress}>
    <View style={[styles.storyRing, !item.own && styles.storyRingActive]}>
      <View style={[styles.storyAvatar, { backgroundColor: item.color }]}>
        {item.own ? <Text style={styles.plus}>＋</Text> : <Text style={styles.storyInitial}>{item.name[0].toUpperCase()}</Text>}
      </View>
    </View>
    <Text style={styles.storyName} numberOfLines={1}>{item.name}</Text>
  </Pressable>;
}

function Post({ post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  return <View style={styles.post}>
    <View style={styles.postHeader}>
      <Image source={{ uri: post.avatar }} style={styles.postAvatar} />
      <View style={{ flex: 1 }}><Text style={styles.username}>{post.name}</Text><Text style={styles.location}>{post.place}</Text></View>
      <Pressable hitSlop={12}><Text style={styles.more}>···</Text></Pressable>
    </View>
    <Pressable onPress={() => setLiked(!liked)}>
      <Image source={{ uri: post.image }} style={styles.postImage} />
    </Pressable>
    <View style={styles.postActions}>
      <View style={styles.actionGroup}>
        <Pressable onPress={() => setLiked(!liked)} hitSlop={9}><Text style={[styles.actionIcon, liked && { color: '#e45463' }]}>{liked ? '♥' : '♡'}</Text></Pressable>
        <Pressable hitSlop={9}><Text style={styles.actionIcon}>○</Text></Pressable>
        <Pressable hitSlop={9}><Text style={styles.actionIcon}>↗</Text></Pressable>
      </View>
      <Pressable onPress={() => setSaved(!saved)} hitSlop={9}><Text style={styles.actionIcon}>{saved ? '▣' : '▢'}</Text></Pressable>
    </View>
    <Text style={styles.likes}>{post.likes} likes</Text>
    <Text style={styles.caption}><Text style={styles.username}>{post.name}  </Text>{post.caption}</Text>
    <Text style={styles.comments}>View all 38 comments</Text>
    <Text style={styles.timestamp}>2 HOURS AGO</Text>
  </View>;
}

export default function App() {
  const [active, setActive] = useState('Home');
  const [webError, setWebError] = useState(false);
  const [webKey, setWebKey] = useState(0);
  return <SafeAreaView style={styles.safe}>
    <StatusBar barStyle="dark-content" backgroundColor="#f7f6f2" />
    <View style={styles.topbar}>
      <Pressable onPress={() => setActive('Home')}><Text style={styles.wordmark}>{active === 'Home' ? 'softfeed' : active === 'You' ? 'you' : active.toLowerCase()}</Text></Pressable>
      <View style={styles.topActions}><Pressable onPress={() => setActive('Notifications')}><Text style={styles.topIcon}>♡</Text></Pressable><Pressable onPress={() => setActive('Messages')}><Text style={styles.topIcon}>↗</Text><View style={styles.dot}/></Pressable></View>
    </View>
    {active === 'Home' ? <View style={styles.webContainer}>
      <WebView
        key={webKey}
        source={{ uri: 'https://www.instagram.com/' }}
        style={styles.webView}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        setSupportMultipleWindows={false}
        startInLoadingState={false}
        onLoadStart={() => setWebError(false)}
        onError={() => setWebError(true)}
        onHttpError={(event) => { if (event.nativeEvent.statusCode >= 400) setWebError(true); }}
      />
      {webError && <View style={styles.webError}><Text style={styles.webErrorTitle}>Instagram didn’t load here</Text><Text style={styles.pageNote}>The website may limit embedded browsing. You can try again or open Instagram in your browser.</Text><Pressable style={styles.primaryButton} onPress={() => { setWebError(false); setWebKey(value => value + 1); }}><Text style={styles.primaryButtonText}>Try again</Text></Pressable></View>}
    </View> : active === 'Messages' || active === 'Notifications' ? <View style={styles.page}><Text style={styles.pageTitle}>{active}</Text><Text style={styles.pageNote}>{active === 'Messages' ? 'Your conversations will appear here.' : 'You’re all caught up.'}</Text></View> : <ScrollView key={active} showsVerticalScrollIndicator={false}><Section name={active}/><View style={{ height: 110 }}/></ScrollView>}
    <View style={styles.floatingWrap}>
      <BlurView intensity={Platform.OS === 'android' ? 45 : 60} tint="light" style={styles.tabBar}>
        {tabs.map(([icon, label]) => <Pressable accessibilityRole="button" accessibilityLabel={label === 'You' ? 'Profile' : label} key={label} onPress={() => setActive(label)} style={styles.tab}>
          <Text style={[styles.tabIcon, active === label && styles.tabIconActive]}>{icon}</Text>
          {active === label && <View style={styles.activeDot} />}
        </Pressable>)}
      </BlurView>
    </View>
    {active !== 'Home' && <View pointerEvents="none" style={styles.demoBadge}><Text style={styles.demoText}>DESIGN PREVIEW · SAMPLE CONTENT</Text></View>}
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f6f2', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0 },
  topbar: { height: 56, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  wordmark: { color: ink, fontSize: 25, fontWeight: '700', letterSpacing: -1.1 },
  topActions: { flexDirection: 'row', gap: 20, alignItems: 'center' }, topIcon: { fontSize: 27, color: ink, fontWeight: '300' }, dot: { position: 'absolute', width: 6, height: 6, borderRadius: 3, backgroundColor: '#db7d6d', right: -1, top: 2 },
  scrollContent: { paddingTop: 8 },
  sectionHeading: { paddingHorizontal: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 },
  sectionTitle: { fontWeight: '700', fontSize: 16, color: ink }, seeAll: { color: muted, fontSize: 12 },
  stories: { paddingHorizontal: 17, gap: 14, paddingBottom: 20 }, story: { width: 62, alignItems: 'center' }, storyRing: { width: 60, height: 60, padding: 3, borderRadius: 30, borderWidth: 1, borderColor: '#d9d7cf', marginBottom: 5 }, storyRingActive: { borderWidth: 1.7, borderColor: '#d48870' }, storyAvatar: { flex: 1, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }, storyInitial: { color: '#fff', fontSize: 20, fontWeight: '600' }, plus: { color: '#fff', fontSize: 26, fontWeight: '300', marginTop: -3 }, storyName: { color: '#625f58', fontSize: 10 },
  feedLabel: { paddingHorizontal: 22, paddingTop: 15, paddingBottom: 13, borderTopWidth: 1, borderTopColor: '#ebe9e3' }, feedTitle: { color: ink, fontSize: 21, fontWeight: '700', letterSpacing: -0.4 }, feedSubtitle: { color: muted, marginTop: 3, fontSize: 12 },
  post: { marginBottom: 21 }, postHeader: { height: 53, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }, postAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#ddd' }, username: { fontWeight: '650', color: ink, fontSize: 12 }, location: { color: muted, fontSize: 10, marginTop: 2 }, more: { color: ink, fontSize: 24, letterSpacing: 1 }, postImage: { width: '100%', aspectRatio: 0.96, backgroundColor: '#e5ded3' }, postActions: { paddingHorizontal: 16, height: 43, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, actionGroup: { flexDirection: 'row', alignItems: 'center', gap: 17 }, actionIcon: { color: ink, fontSize: 25, fontWeight: '300' }, likes: { paddingHorizontal: 17, color: ink, fontWeight: '700', fontSize: 11, marginBottom: 5 }, caption: { paddingHorizontal: 17, color: '#494741', fontSize: 12, lineHeight: 18 }, comments: { paddingHorizontal: 17, color: '#99968e', fontSize: 11, marginTop: 5 }, timestamp: { paddingHorizontal: 17, color: '#aaa79e', fontSize: 9, letterSpacing: 0.7, marginTop: 8 },
  floatingWrap: { position: 'absolute', bottom: Platform.OS === 'android' ? 20 : 13, left: 30, right: 30, borderRadius: 29, overflow: 'hidden', shadowColor: '#28251f', shadowOpacity: 0.12, shadowRadius: 18, shadowOffset: { width: 0, height: 7 }, elevation: 10 }, tabBar: { height: 58, borderRadius: 29, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderWidth: 1, borderColor: 'rgba(255,255,255,0.78)', backgroundColor: 'rgba(255,255,255,0.35)' }, tab: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' }, tabIcon: { fontSize: 24, color: '#99968e', lineHeight: 27 }, tabIconActive: { color: '#23221f', fontWeight: '700' }, activeDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#c77b68', marginTop: 2 },
  demoBadge: { position: 'absolute', top: Platform.OS === 'android' ? 61 : 68, alignSelf: 'center', backgroundColor: 'rgba(247,246,242,0.9)', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10 }, demoText: { color: '#99968e', fontSize: 8, letterSpacing: 1, fontWeight: '600' },
  page: { padding: 22, minHeight: 500 }, pageTitle: { color: ink, fontSize: 27, fontWeight: '700', letterSpacing: -0.7, marginBottom: 16 }, pageNote: { color: muted, fontSize: 12, lineHeight: 18, marginTop: 5 }, searchBox: { height: 43, borderRadius: 13, backgroundColor: '#eeece6', justifyContent: 'center', paddingHorizontal: 14 }, searchHint: { color: '#96938b', fontSize: 13 }, discoverGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginHorizontal: -22, marginTop: 17 }, gridImage: { width: '32.8%', aspectRatio: 0.84, backgroundColor: '#e5ded3' }, createCard: { minHeight: 300, backgroundColor: '#efede7', borderRadius: 24, alignItems: 'center', justifyContent: 'center', padding: 24 }, createIcon: { fontSize: 36, color: '#b97663' }, createTitle: { fontSize: 18, fontWeight: '700', color: ink, marginTop: 12 }, primaryButton: { backgroundColor: ink, borderRadius: 22, paddingVertical: 12, paddingHorizontal: 20, marginTop: 20 }, primaryButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' }, reelCard: { height: 490, borderRadius: 22, overflow: 'hidden', backgroundColor: '#d8d3c9' }, reelImage: { width: '100%', height: '100%' }, reelOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'rgba(0,0,0,0.08)' }, reelPlay: { color: '#fff', fontSize: 42, marginTop: 180 }, reelCaption: { color: '#fff', fontSize: 13, fontWeight: '600', alignSelf: 'flex-start' }, profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 18, marginBottom: 20 }, profileAvatar: { width: 74, height: 74, borderRadius: 37, backgroundColor: '#e4c7a3', alignItems: 'center', justifyContent: 'center' }, profileInitial: { color: '#fff', fontSize: 28, fontWeight: '700' }, profileName: { color: ink, fontWeight: '700', fontSize: 16 }, profileStats: { flex: 1 }, profileBio: { marginBottom: 15 }, secondaryButton: { borderRadius: 12, padding: 11, backgroundColor: '#eeece6', alignItems: 'center', marginBottom: 24 }, secondaryButtonText: { color: ink, fontSize: 12, fontWeight: '600' },
  webContainer: { flex: 1, backgroundColor: '#fff' }, webView: { flex: 1, backgroundColor: '#fff' }, webError: { ...StyleSheet.absoluteFillObject, backgroundColor: '#f7f6f2', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34 }, webErrorTitle: { color: ink, fontSize: 18, fontWeight: '700' },
});
