import { getFirestore, collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, orderBy} from 'firebase/firestore';
import { app } from './firebase.js';

const db = getFirestore(app);

// Função para criar um novo post
export const createPost = async (userId, content) => {
  try {
    const post = {
      userId,
      content,
      likes: 0,
      comments: [],
      timestamp: new Date().getTime(),
    };

    const docRef = await addDoc(collection(db, 'posts'), post);
    console.log('Novo post criado com ID:', docRef.id);
  } catch (error) {
    console.log('Erro ao criar o post:', error);
  }
};

// Função para adicionar um comentário a um post
export const addComment = async (postId, userId, comment) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDocs(postRef);

    if (postSnap.exists()) {
      const post = postSnap.data();
      post.comments.push({ userId, comment });

      await updateDoc(postRef, { comments: post.comments });
      console.log('Comentário adicionado com sucesso');
    } else {
      console.log('O post não existe');
    }
  } catch (error) {
    console.log('Erro ao adicionar comentário:', error);
  }
};

// Adicionar uma curtida a um post
export const addLike = async (postId, userId) => {
  const postRef = doc(db, 'posts', postId);
  const likesRef = collection(postRef, 'likes');

  // Verifica se o usuário já curtiu o post antes de adicionar uma nova curtida
  const likeQuery = await getDocs(likesRef.where('userId', '==', userId));
  if (likeQuery.empty) {
    // Adiciona uma nova curtida ao post
    await addDoc(likesRef, {
      userId,
      createdAt: new Date(),
    });

    // Atualiza o contador de curtidas no post
    const postDoc = await getDocs(postRef);
    if (postDoc.exists()) {
      const likesCount = postDoc.data().likesCount || 0;
      await updateDoc(postRef, {
        likesCount: likesCount + 1,
      });
    }
  }
};

// Remover uma curtida de um post
export const removeLike = async (postId, userId) => {
  const postRef = doc(db, 'posts', postId);
  const likesRef = collection(postRef, 'likes');

  // Verifica se o usuário já curtiu o post antes de remover a curtida
  const likeQuery = await getDocs(likesRef.where('userId', '==', userId));
  if (!likeQuery.empty) {
    const likeDoc = likeQuery.docs[0];

    // Remove o documento de curtida
    await deleteDoc(likeDoc.ref);

    // Atualiza o contador de curtidas no post
    const postDoc = await getDocs(postRef);
    if (postDoc.exists()) {
      const likesCount = postDoc.data().likesCount || 0;
      await updateDoc(postRef, {
        likesCount: likesCount - 1,
      });
    }
  }
};

// Verificar se um usuário curtiu um post específico
export const hasLikedPost = async (postId, userId) => {
  const postRef = doc(db, 'posts', postId);
  const likesRef = collection(postRef, 'likes');

  const likeQuery = await getDocs(likesRef.where('userId', '==', userId));
  return !likeQuery.empty;
};

// Função para deletar um post
export const deletePost = async (postId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
    console.log('Post deletado com sucesso');
  } catch (error) {
    console.log('Erro ao deletar o post:', error);
  }
};

// Função para editar o conteúdo de um post
export const editPost = async (postId, newContent) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, { content: newContent });
    console.log('Post editado com sucesso');
  } catch (error) {
    console.log('Erro ao editar o post:', error);
  }
};

// Função para obter os posts mais recentes
export const getPosts = async () => {
  const postsRef = collection(db, 'posts');

  // Obtém todos os posts ordenados por data de criação (do mais recente para o mais antigo)
  const q = query(postsRef, orderBy('createdAt', 'desc'));

  // Obtém os documentos dos posts
  const querySnapshot = await getDocs(q);
  const posts = [];
  for (const doc of querySnapshot.docs) {
    const post = doc.data();

    // Obtém os detalhes do usuário
    const userSnapshot = await getDocs(doc.ref.parent.parent);
    const user = userSnapshot.docs[0].data();

    // Adiciona os detalhes do usuário ao post
    post.userId = user.userId;
    post.userName = user.username;
    post.userProfilePhoto = user.profilePhoto;

    posts.push(post);
  }

  return posts;
};
